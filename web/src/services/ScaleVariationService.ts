import { useState } from 'react';
import { useAppOptionsContext } from '..';
import { useRequest } from '../hooks';
import { IGenerateResponseHeader } from '../interfaces';
import { ScaleVariation } from '../models';
import { ScaleVariationApi, ScaleVariationGenerateParams } from '../network';

export const useScaleVariationService = () => {
  const { appOptions } = useAppOptionsContext();
  const { scale, tuning } = appOptions;

  const [header, setHeader] = useState<
    IGenerateResponseHeader<ScaleVariation>
  >();

  const [variations, setVariations] = useState<ScaleVariation[]>();

  const { req: generateVariations, loading } = useRequest(
    new ScaleVariationApi().Generate
  );

  const validate = (params: ScaleVariationGenerateParams) => {
    const required = [];
    if (!tuning) {
      required.push('Tuning');
    } else if (!tuning?.Offsets?.length) {
      required.push ('At least one string');
    }
    if (!scale) {
      required.push('Scale');
    }
  }

  const generate = (params: ScaleVariationGenerateParams) => {
    if (tuning.Offsets.length === 0) {
      setVariations([]);
      // TODO:
      debugger;
      return null;
    } else {
      return generateVariations({
        baseId: scale.Id,
        tuningId: tuning.Id,
        ...params,
      }).then((newHeader: IGenerateResponseHeader<ScaleVariation>) => {
        setHeader({ ...newHeader, Variations: null });
        setVariations(newHeader.Variations);
      });
    }
  };

  return { header, variations, generate, loading };
};
