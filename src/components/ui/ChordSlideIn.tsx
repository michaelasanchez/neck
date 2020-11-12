import { each, filter, findIndex, map, times } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import { ChordDiagram, SlideIn } from '.';
import { Chord, ChordModifier, ChordVariation, Note } from '../../models';
import { IAppOptions } from '../../shared';
import { ChordUtils, VARIATION_SPAN_DEFAULT } from '../../shared/chord.utils';
import { IndicatorsDisplayOptions } from '../Indicators';

export const FILTER_BY_CHORD_FORM = false;
export const FILTER_DUPLICATES = true;

export interface IChordSlideInProps {
  appOptions: IAppOptions;
  setIndicatorsOptions: (update: Partial<IndicatorsDisplayOptions>) => void;
}

const buttonStyle: React.CSSProperties = {
  position: 'fixed',
  width: 100,
  height: 40,
  top: 10,
  left: 10,
};

const prevStyle: React.CSSProperties = {
  ...buttonStyle,
  left: 10,
};

const nextStyle: React.CSSProperties = {
  ...buttonStyle,
  left: 120,
};

export const ChordSlideIn: React.FC<IChordSlideInProps> = ({
  appOptions,
  setIndicatorsOptions,
}) => {
  const { numFrets, tuning } = appOptions;

  const [variations, setVariations] = useState<ChordVariation[]>();
  const [currentVariationIndex, setCurrentVariationIndex] = useState<number>(0);

  // Init
  useEffect(() => {
    // Test Chord
    const chord = new Chord(Note.C(), ChordModifier.Major);
    const variations: ChordVariation[] = [];

    // Generate chord variations
    const span = VARIATION_SPAN_DEFAULT;
    times(numFrets - span + 2, (offset) => {
      each(
        ChordUtils.calcVariations(chord, tuning, offset, span),
        (newVariation) => {
          if (
            !FILTER_DUPLICATES ||
            findIndex(variations, (v) => v.Equals(newVariation)) < 0
          )
            variations.push(newVariation);
        }
      );
    });

    // Only keep variations that match a chord form
    let filteredVariations: ChordVariation[];
    if (FILTER_BY_CHORD_FORM) {
      filteredVariations = filter(variations, (v) => v.hasChordForm());
    }

    setVariations(filteredVariations || variations);
  }, []);


  useEffect(() => {
    if (variations) {
      console.log(variations);
      setIndicatorsOptions({ chord: variations[0] });
    }
  }, [variations]); 

  const renderDebug = () => {
    if (!variations) {
      return <></>;
    }

    const getNextVariationIndex = (next: number): number =>
      (currentVariationIndex + variations.length + next) % variations.length;

    return (
      <>
        <Button
          disabled={!variations.length}
          style={prevStyle}
          onClick={() => setCurrentVariationIndex(getNextVariationIndex(-1))}
        >
          Prev
        </Button>
        <Button
          disabled={!variations.length}
          style={nextStyle}
          onClick={() => setCurrentVariationIndex(getNextVariationIndex(1))}
        >
          Next
        </Button>
      </>
    );
  };

  const tester = (e: any) => {
    console.log('e', e);
  }

  return (
    <SlideIn>
      {map(variations, (v: ChordVariation, i: number) => (
        <ChordDiagram chordVariation={v} key={i} onClick={setIndicatorsOptions} />
      ))}
    </SlideIn>
  );
};
