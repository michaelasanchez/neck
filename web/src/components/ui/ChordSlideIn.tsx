import { filter, findIndex, indexOf, map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { ChordDiagram, SlideIn } from '.';
import { Chord, ChordModifier, ChordVariation, Note } from '../../models';
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
    case ChordModifier.Suspended:
      return 'sus';
    case ChordModifier.Augmented:
      return 'aug';
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
    case ChordModifier.Suspended:
      return 'Suspended';
    case ChordModifier.Augmented:
      return 'Augmented';
  }
};

export const ChordSlideIn: React.FC<IChordSlideInProps> = ({
  appOptions,
  setAppOptions,
}) => {
  const { chord, variations } = appOptions;

  const setChordVariation = (variation: ChordVariation) =>
    setAppOptions({ chordVariation: variation });

  // TODO: this could probably occur after we first get
  //  the new set of variations
  useEffect(() => {
    if (variations?.length > 0) {
      setChordVariation(variations[0]);
    }
  }, [variations]);

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
      setAppOptions({
        chord: new Chord(
          updatedRoot || rootNote,
          updatedModifier !== undefined ? updatedModifier : modifier
        ),
      });
    }
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
            disabled={indexOf([0, 1, 3, 4, 7], i) < 0} // TODO: this really shouldn't be here. DEBUG ONLY!
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
              chordVariation={v}
              key={i}
              setChordVariation={setChordVariation}
            />
          ))
        ) : (
          <> Nope!</>
        )}
      </div>
    </SlideIn>
  );
};
