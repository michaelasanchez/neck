import { map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { SlideIn } from '.';
import { ScaleVariation } from '../../models';
import { ScaleVariationApi } from '../../network/ScaleVariationApi';
import { AppOptions } from '../../shared';
import { Diagram, ScaleDiagram } from './diagrams';

export interface IScaleSlideInProps {
  appOptions: AppOptions;
  setAppOptions: (updated: Partial<AppOptions>) => void;
}

export const ScaleSlideIn: React.FC<IScaleSlideInProps> = ({
  appOptions,
  setAppOptions,
}) => {
  const { instrument, scale, tuning } = appOptions;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [variations, setVariations] = useState<ScaleVariation[]>([]);

  useEffect(() => {
    new ScaleVariationApi()
      .GenerateRange({
        baseId: scale.Id,
        tuningId: tuning.Id,
        span: 5,
        // offset: 5,
        range: instrument.NumFrets,
      })
      .then((variations: ScaleVariation[]) => {
        setVariations(variations);

        if (variations.length) setAppOptions({ scaleVariation: variations[0] });
      });
  }, []);

  useEffect(() => {}, [appOptions.scale]);

  const handleSetChordVariation = (
    variation: ScaleVariation,
    index: number
  ) => {
    setAppOptions({ scaleVariation: variation });
    setCurrentIndex(index);
  };

  return (
    <SlideIn className="scale" title={<h2>Scale </h2>} loading={false}>
      <div className="variations">
        {map(variations, (v, i) => (
          <ScaleDiagram
            key={i}
            active={i == currentIndex}
            variation={v}
            setVariation={(v) => handleSetChordVariation(v, i)}
          />
        ))}
      </div>
    </SlideIn>
  );
};
