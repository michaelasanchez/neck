import { filter, findIndex, map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { ChordDiagram, SlideIn, UiOptions } from '.';
import { Chord, ChordModifier, ChordVariation, Note } from '../../models';
import { IAppOptions } from '../../shared';
import { IndicatorsDisplayOptions } from '../Indicators';

export const FILTER_BY_CHORD_FORM = false;
export const FILTER_DUPLICATES = false;

const SlideInTitle = 'Chord';

export interface IChordSlideInProps {
  setIndicatorsOptions: (update: Partial<IndicatorsDisplayOptions>) => void;
  setAppOptions: (update: Partial<IAppOptions>) => void;
  appOptions: IAppOptions;
  uiOptions: UiOptions;
}

const notes = [
  Note.A(),
  Note.B(),
  Note.C(),
  Note.D(),
  Note.E(),
  Note.F(),
  Note.G(),
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
  setIndicatorsOptions,
  setAppOptions,
  appOptions,
  uiOptions,
}) => {
  const [variations, setVariations] = useState<ChordVariation[]>();

  useEffect(() => {
    if (uiOptions?.variations?.length) setVariations(uiOptions.variations);
  }, [uiOptions?.variations]);

  useEffect(() => {
    if (variations) {
      setIndicatorsOptions({ chord: variations[0] });
    }
  }, [variations]);

  const modifiers = filter(ChordModifier, (m) => isNaN(m));

  const rootNote = appOptions?.chord?.Root;
  const modifier = appOptions?.chord?.Modifier;

  let selectedRootIndex = rootNote
    ? findIndex(notes, (n) => rootNote.Equals(n))
    : null;

  const handleRootUpdate = (root: Note) => handleChordUpdate(root);
  const handleModifierUpdate = (mod: ChordModifier) =>
    handleChordUpdate(null, mod);

  const handleChordUpdate = (root?: Note, mod?: ChordModifier) => {
    let update = false;
    let updatedRoot: Note, updatedModifier: ChordModifier;

    if (!!root && !rootNote.Equals(root)) {
      update = true;
      updatedRoot = root;
    }
    if (!!mod && mod != modifier) {
      update = true;
      updatedModifier = mod;
    }

    if (updatedRoot || updatedModifier) {
      setAppOptions({
        chord: new Chord(updatedRoot || rootNote, updatedModifier || modifier),
      });
    }
  };

  const headerButton = (
    <>
      <ButtonGroup size="lg" className="mb-2">
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
          title={getChordModifierLabel(modifier)}
          id="dropdown-modifier"
        >
          {map(modifiers, (m: string, i: number) => (
            <Dropdown.Item
              eventKey={i.toString()}
              key={i}
              active={i == modifier}
              onSelect={() => handleModifierUpdate(i)}
            >
              {getChordModifierLabel(i)}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </ButtonGroup>
    </>
  );

  return (
    <SlideIn
      className="chord"
      headerTitle={<h2>{SlideInTitle}</h2>}
      headerButton={headerButton}
      loading={!variations}
    >
      {map(variations, (v: ChordVariation, i: number) => (
        <ChordDiagram
          chordVariation={v}
          key={i}
          onClick={setIndicatorsOptions}
        />
      ))}
    </SlideIn>
  );
};
