import * as React from 'react';
import { useEffect } from 'react';

import { SlideIn } from '.';
import { ScaleVariation } from '../../models';
import { ScaleVariationApi } from '../../network/ScaleVariationApi';
import { AppOptions } from '../../shared';

export interface IScaleSlideInProps {
  setAppOptions: (updated: Partial<AppOptions>) => void;
}

export const ScaleSlideIn: React.FC<IScaleSlideInProps> = (props) => {
  const { setAppOptions } = props;

  useEffect(() => {
    new ScaleVariationApi().Generate().then((variations: ScaleVariation[]) => {
      
      // DEBUG
      console.log(variations);

      if (variations.length) setAppOptions({ scaleVariation: variations[0] });
    });
  }, []);

  return (
    <SlideIn
      className="scale"
      title={<h2>Scale </h2>}
      loading={false}
    ></SlideIn>
  );
};
