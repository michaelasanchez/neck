import { filter, findIndex, indexOf, map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

import { SlideIn } from '..';
import { Chord, ChordModifier, ChordVariation, Note, NoteValue } from '../../../models';
import { ChordVariationApi } from '../../../network';
import { AppOptions, NoteUtils } from '../../../shared';
import { NoteSelection } from '../../NoteSelection';
import { ChordDiagram } from '../diagrams';

export const FILTER_BY_CHORD_FORM = false;
export const FILTER_DUPLICATES = false;

const ALLOW_MULTIPLE = false;

export interface IChordSlideInProps {
  setAppOptions: (update: Partial<AppOptions>) => void;
  appOptions: AppOptions;
}

// Badge Chord Modifier
const modifiers = filter(ChordModifier, (m) => isNaN(m));

// Badge Root Note
const notes = [
  Note.A(),
  Note.B().Flat(),
  Note.B(),
  Note.C().Flat(),
  Note.C(),
  Note.C().Sharp(),
  Note.D().Flat(),
  Note.D(),
  Note.E().Flat(),
  Note.E(),
  Note.F(),
  Note.F().Sharp(),
  Note.G().Flat(),
  Note.G(),
  Note.A().Flat(),
];

export const ChordSlideIn: React.FC<IChordSlideInProps> = ({
  appOptions,
  setAppOptions,
}) => {
  // Props
  const { chord, instrument, tuning } = appOptions;

  // State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [variations, setVariations] = useState<ChordVariation[]>();

  const [selected, setSelected] = useState<NoteValue[]>();

  // Side Effects
  useEffect(() => {
    if (!!chord) {
      setSelected([]);
      reloadChordVariations();
    }
  }, [appOptions?.chord]);

  // Load
  const reloadChordVariations = () => {
    new ChordVariationApi()
      .GenerateRange({
        baseId: chord.Id,
        tuningId: tuning.Id,
        range: instrument.NumFrets,
        // span: 9,
      })
      .then((variations: any[]) => {
        // TODO: constructor logic should probably move
        const newVariations = map(
          variations,
          (v) =>
            new ChordVariation(
              v.Formation.Positions,
              v.Formation.Barres,
              tuning
            )
        );

        setVariations(newVariations);
        if (newVariations.length) {
          handleSetChordVariation(newVariations[0], 0);
        }
      });
  };

  // Render State
  const rootNote = chord?.Root;
  const modifier = chord?.Modifier;

  let selectedRootIndex = rootNote
    ? findIndex(notes, (n) => NoteUtils.NotesAreEqual(n, rootNote))
    : null;

  // Header Badge Actions
  const handleRootUpdate = (root: Note) => handleChordUpdate(root);
  const handleModifierUpdate = (mod: ChordModifier) =>
    handleChordUpdate(null, mod);

  // State Updates
  const handleChordUpdate = (root?: Note, mod?: ChordModifier) => {
    let updatedRoot: Note, updatedModifier: ChordModifier;

    if (!!root && !NoteUtils.NotesAreEqual(chord.Root, root)) {
      updatedRoot = root;
    }
    if (mod !== null && mod != modifier) {
      updatedModifier = mod;
    }

    if (updatedRoot || updatedModifier !== null) {
      const chord = new Chord(
        updatedRoot || rootNote,
        updatedModifier !== undefined ? updatedModifier : modifier
      );

      setAppOptions({ chord });
    }
  };

  const handleSetChordVariation = (
    variation: ChordVariation,
    index: number
  ) => {
    setAppOptions({ chordVariation: variation });
    setCurrentIndex(index);
  };

  const handleSelectedUpdate = (value: NoteValue) => {
    if (!ALLOW_MULTIPLE) {
      if (selected.length && selected[0] == value) {
        setSelected([]);
      } else {
        setSelected([value]);
      }
    } else {
      if (filter(selected, (v) => v === value).length) {
        selected.splice(indexOf(selected, value), 1);
      } else {
        selected.push(value);
      }
      setSelected([...selected]);
    }
  };

  // Render
  const headerBadge = (
    <ButtonGroup size="lg">
      <DropdownButton
        variant="secondary"
        as={ButtonGroup}
        title={rootNote.Label}
        id="dropdown-note"
      >
        {map(notes, (n: Note, i: number) => (
          <Dropdown.Item
            eventKey={i.toString()}
            key={i}
            active={i == selectedRootIndex}
            onSelect={() => handleRootUpdate(n)}
          >
            {n.Label}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <DropdownButton
        variant="secondary"
        as={ButtonGroup}
        title={Chord.getModifierAbbreviation(modifier)}
        id="dropdown-modifier"
      >
        {map(modifiers, (m: string, i: number) => (
          <Dropdown.Item
            eventKey={i.toString()}
            key={i}
            active={i == modifier}
            onSelect={() => handleModifierUpdate(i)}
            disabled={indexOf([2, 4, 5, 10], i) >= 0} // TODO: manually filtering chord modifiers
          >
            {Chord.getModifierLabel(i)}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </ButtonGroup>
  );

  return (
    <SlideIn
      className="chord"
      title={
        <h2>
          Chord{' '}
          <span className="h6 text-muted">({variations?.length || 0})</span>
        </h2>
      }
      badge={headerBadge}
      header={
        <NoteSelection
          notes={chord.Tones}
          selected={selected}
          setSelected={handleSelectedUpdate}
        />
      }
      loading={variations == null}
    >
      <div className="variations">
        {variations?.length > 0 ? (
          map(variations, (v: ChordVariation, i: number) => (
            <ChordDiagram
              active={i == currentIndex}
              chord={chord}
              chordVariation={v}
              highlighted={selected}
              key={i}
              setChordVariation={(v) => handleSetChordVariation(v, i)}
            />
          ))
        ) : (
          <> Nope!</>
        )}
      </div>
    </SlideIn>
  );
};
