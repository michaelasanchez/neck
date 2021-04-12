import { useEffect, useState } from 'react';
import { useRequest } from '.';
import { useAppOptionsContext } from '..';
import { ScaleType } from '../enums';
import {
  ChordVariation,
  FretMap,
  FretNote,
  Key,
  KeyType,
  ScaleVariation,
} from '../models';
import { KeyApi } from '../network';

const UPDATE_KEY_WITH_SCALE = false;

export const useIndicatorsOptions = () => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { instrument, key, scale, tuning } = appOptions;

  const { req: updateKey } = useRequest<Key>(new KeyApi().LocateAsync);

  const [searchArray, setSearchArray] = useState<FretNote[]>([]);
  const [fretMap, setFretMap] = useState<FretMap>();

  const [chordVariation, setChordVariation] = useState<ChordVariation>();
  const [scaleVariation, setScaleVariation] = useState<ScaleVariation>();

  useEffect(() => {
    setFretMap(new FretMap(instrument, tuning, key.Scale));
  }, [instrument, tuning, key]);

  // TODO: Probably shouldn't be here
  useEffect(() => {
    if (UPDATE_KEY_WITH_SCALE) {
      updateKey(
        scale.Type == ScaleType.NaturalMinor ? KeyType.Minor : KeyType.Major,
        scale.Tonic.Base,
        scale.Tonic.Suffix
      ).then((k) => setAppOptions({ key: k }));
    }
  }, [scale]);

  const handleSetSearchArray = (updated: FretNote[]) => {
    setSearchArray([...updated]);
  };

  return {
    chordVariation,
    scaleVariation,
    searchArray,
    fretMap,
    setChordVariation,
    setScaleVariation,
    setSearchArray: handleSetSearchArray,
  };
};
