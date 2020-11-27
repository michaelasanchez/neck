import { map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { ChordDiagram, SlideIn, UiOptions } from '.';
import { ChordVariation } from '../../models';
import { IAppOptions } from '../../shared';
import { IndicatorsDisplayOptions } from '../Indicators';

export const FILTER_BY_CHORD_FORM = false;
export const FILTER_DUPLICATES = false;

export interface IChordSlideInProps {
  appOptions: IAppOptions;
  setIndicatorsOptions: (update: Partial<IndicatorsDisplayOptions>) => void;
  uiOptions: UiOptions;
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
  uiOptions,
}) => {
  const { numFrets, tuning } = appOptions;

  const [variations, setVariations] = useState<ChordVariation[]>();
  const [currentVariationIndex, setCurrentVariationIndex] = useState<number>(0);

  useEffect(() => {
    if (uiOptions?.variations?.length)
      setVariations(uiOptions.variations);
  }, [uiOptions?.variations]);

  useEffect(() => {
    if (variations) {
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
  return (
    <SlideIn>
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
