import { map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { ChordDiagram, SlideIn, UiOptions } from '.';
import { ChordModifier, ChordVariation, Note } from '../../models';
import { IAppOptions } from '../../shared';
import { IndicatorsDisplayOptions } from '../Indicators';

export const FILTER_BY_CHORD_FORM = false;
export const FILTER_DUPLICATES = false;

const SlideInTitle = 'Chord';

export interface IChordSlideInProps {
  setIndicatorsOptions: (update: Partial<IndicatorsDisplayOptions>) => void;
  appOptions: IAppOptions;
  uiOptions: UiOptions;
}

export const ChordSlideIn: React.FC<IChordSlideInProps> = ({
  setIndicatorsOptions,
  appOptions,
  uiOptions,
}) => {

  const [rootNote, setRootNote] = useState<Note>(appOptions?.chord?.Root);
  const [modifier, setModifier] = useState<ChordModifier>(appOptions?.chord?.Modifier);

  const [variations, setVariations] = useState<ChordVariation[]>();

  useEffect(() => {
    console.log('CURRENT', appOptions?.chord);
    console.log('STATE', rootNote, modifier);
  }, [appOptions?.chord]);

  useEffect(() => {
    if (uiOptions?.variations?.length) setVariations(uiOptions.variations);
  }, [uiOptions?.variations]);

  useEffect(() => {
    if (variations) {
      setIndicatorsOptions({ chord: variations[0] });
    }
  }, [variations]);

  const notes = [
    Note.A(),
    Note.B(),
    Note.C(),
    Note.D(),
    Note.E(),
    Note.F(),
    Note.G(),
  ];

  console.log('RENDER', uiOptions, notes, ChordModifier);

  // TODO: should have chord on ui options now
  //  just have to matchs that to a note in the
  //  notes array and... its.. so.. close

  const headerTitle = <h2>{SlideInTitle}</h2>;
  const headerButton = (
    <>
      <ButtonGroup size="lg" className="mb-2">
        <DropdownButton
          variant="secondary"
          as={ButtonGroup}
          title="C"
          id="dropdown-note"
        >
          {map(notes, (n: Note, i: number) => (
            <Dropdown.Item eventKey={i.toString()} key={i}>
              {n.Label}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DropdownButton
          variant="secondary"
          as={ButtonGroup}
          title="Major"
          id="dropdown-modifier"
        >
          {map(notes, (n: Note, i: number) => (
            <Dropdown.Item eventKey={i.toString()} key={i}>
              {n.Label}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </ButtonGroup>
    </>
  );

  return (
    <SlideIn
      className="chord"
      headerTitle={headerTitle}
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
