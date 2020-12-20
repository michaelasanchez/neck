import { filter, findIndex, indexOf, map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { ChordDiagram, SlideIn } from '.';
import {
  Chord,
  ChordModifier,
  ChordVariation,
  Instrument,
  Note,
  Tuning,
} from '../../models';
import {
  ChordVariationApi,
  ChordVariationGenerateRangeParams,
} from '../../network';
import { AppOptions, NoteUtils } from '../../shared';
import { NoteSelection } from '../NoteSelection';

export const FILTER_BY_CHORD_FORM = false;
export const FILTER_DUPLICATES = false;
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

const getChordModifierAbbreviation = (mod: ChordModifier): string => {
  switch (mod) {
    case ChordModifier.Major:
      return 'maj';
    case ChordModifier.Minor:
      return 'min';
    case ChordModifier.Diminished:
      return 'dim';
    case ChordModifier.MajorSeventh:
      return 'maj7';
    case ChordModifier.MinorSeventh:
      return 'min7';
    case ChordModifier.DominantSeventh:
      return '7';
    case ChordModifier.Suspended:
      return 'sus';
    case ChordModifier.Augmented:
      return 'aug';
    case ChordModifier.AugmentedSeventh:
      return 'aug7';
  }
};

const getChordModifierLabel = (mod: ChordModifier): string => {
  switch (mod) {
    case ChordModifier.Major:
      return 'Major';
    case ChordModifier.Minor:
      return 'Minor';
    case ChordModifier.Diminished:
      return 'Diminished';
    case ChordModifier.MajorSeventh:
      return 'Major 7';
    case ChordModifier.MinorSeventh:
      return 'Minor 7';
    case ChordModifier.DominantSeventh:
      return '7';
    case ChordModifier.Suspended:
      return 'Suspended';
    case ChordModifier.Augmented:
      return 'Augmented';
    case ChordModifier.AugmentedSeventh:
      return 'Augmented 7';
  }
};

export const ChordSlideIn: React.FC<IChordSlideInProps> = ({
  appOptions,
  setAppOptions,
}) => {
  // Properties
  const { chord, instrument, tuning } = appOptions;

  // State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [variations, setVariations] = useState<ChordVariation[]>();

  // Side Effects
  useEffect(() => {
    if (!!chord) {
      reloadChordVariations();
    }
  }, [appOptions?.chord]);

  // Load
  const reloadChordVariations = () => {
    new ChordVariationApi()
      .GenerateRange({
        chordId: chord.Id,
        tuningId: tuning.Id,
        range: instrument.NumFrets,
      } as ChordVariationGenerateRangeParams)
      .then((variations: any[]) => {
        // TODO: constructor logic should probably move
        const newVariations = map(
          variations,
          (v) =>
            new ChordVariation(
              v.Formation.Positions,
              v.Formation.Barres,
              v.Tuning
            )
        );

        setVariations(newVariations);
        if (newVariations.length) {
          handleSetChordVariation(newVariations[0], 0);
        }
      });
  };

  const rootNote = chord?.Root;
  const modifier = chord?.Modifier;

  let selectedRootIndex = rootNote
    ? findIndex(notes, (n) => NoteUtils.NotesAreEqual(n, rootNote))
    : null;

  const handleRootUpdate = (root: Note) => handleChordUpdate(root);
  const handleModifierUpdate = (mod: ChordModifier) =>
    handleChordUpdate(null, mod);

  const handleChordUpdate = (root?: Note, mod?: ChordModifier) => {
    let update = false;
    let updatedRoot: Note, updatedModifier: ChordModifier;

    if (!!root && !NoteUtils.NotesAreEqual(rootNote, root)) {
      update = true;
      updatedRoot = root;
    }
    if (mod !== null && mod != modifier) {
      update = true;
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
        title={getChordModifierAbbreviation(modifier)}
        id="dropdown-modifier"
      >
        {map(modifiers, (m: string, i: number) => (
          <Dropdown.Item
            eventKey={i.toString()}
            key={i}
            active={i == modifier}
            onSelect={() => handleModifierUpdate(i)}
            disabled={indexOf([0, 1, 3, 4, 5, 7, 8], i) < 0} // TODO: manually filtering chord modifiers
          >
            {getChordModifierLabel(i)}
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
      header={<NoteSelection notes={chord.Tones} />}
      loading={variations == null}
    >
      <div className="variations">
        {variations?.length > 0 ? (
          map(variations, (v: ChordVariation, i: number) => (
            <ChordDiagram
              chord={chord}
              chordVariation={v}
              key={i}
              setChordVariation={(v) => handleSetChordVariation(v, i)}
              active={i == currentIndex}
            />
          ))
        ) : (
          <> Nope!</>
        )}
      </div>
      <div className="footer text-secondary">
        <small>{currentIndex != null ? currentIndex + 1 : '-'}</small>
        <small style={{ padding: '0 .5em' }}>/</small>
        <small>{variations?.length || '-'}</small>
      </div>
    </SlideIn>
  );
};
