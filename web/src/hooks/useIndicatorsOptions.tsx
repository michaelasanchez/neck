import { filter, findIndex, map, reduce, sum, times } from 'lodash';
import { useEffect, useState } from 'react';
import { useRequest } from '.';
import { useAppOptionsContext } from '..';
import { ScaleType } from '../enums';
import {
  ChordVariation,
  FretMap,
  FretNote,
  Instrument,
  Key,
  KeyType,
  ScaleVariation,
} from '../models';
import { KeyApi } from '../network';

const UPDATE_KEY_WITH_SCALE = false;

const getEmptyMatrix = (instrument: Instrument, searchArray: FretNote[]) => {
  return times(instrument.NumStrings, (s) =>
    times(instrument.NumFrets, (f) =>
      filter(searchArray, (n) => n.String == s && n.Fret == f)?.length > 0
        ? true
        : false
    )
  );
};

export const useIndicatorsOptions = () => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { instrument, key, scale, tuning } = appOptions;

  const { req: updateKey } = useRequest<Key>(new KeyApi().LocateAsync);

  const [searchArray, setSearchArray] = useState<FretNote[]>([]);
  const [fretMap, setFretMap] = useState<FretMap>();

  const [selectedMatrix, setSelectedMatrix] = useState<boolean[][]>();

  const [chordVariation, setChordVariation] = useState<ChordVariation>();
  const [scaleVariation, setScaleVariation] = useState<ScaleVariation>();

  // Reset search matrix
  useEffect(() => {
    setSelectedMatrix(getEmptyMatrix(instrument, searchArray));
  }, []);

  useEffect(() => {
    const selected = sum(
      map(selectedMatrix, (s) =>
        reduce(s, (prev, curr) => prev + (curr ? 1 : 0), 0)
      )
    );
    if (!searchArray.length && !!selected) {
      setSelectedMatrix(getEmptyMatrix(instrument, searchArray));
    }
  }, [searchArray]);

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
  useEffect(() => {
    const mappedSearchArray = map(
      searchArray,
      (n: FretNote, i: number) => fretMap.Notes[n.String][n.Fret]
    );
    setSearchArray(mappedSearchArray);
  }, [fretMap]);

  const toggleSelectedMatrix = (s: number, f: number, set: boolean = null) => {
    const currentValue = selectedMatrix[s][f];
    const newValue = set === null ? !currentValue : set;
    selectedMatrix[s][f] = newValue;

    setSelectedMatrix([...selectedMatrix]);
    handleUpdateSearchArray(fretMap.Notes[s][f]);
  };

  const handleSetSearchArray = (updated: FretNote[]) => {
    setSearchArray([...updated]);
  };

  const handleUpdateSearchArray = (note: FretNote) => {
    if (!!note) {
      const index = findIndex(
        searchArray,
        (n: FretNote) => n.String == note.String && n.Fret == note.Fret
      );
      index < 0 ? searchArray.push(note) : searchArray.splice(index, 1);
      setSearchArray(searchArray);
    }
  };

  return {
    fretMap,
    chordVariation,
    scaleVariation,
    searchArray,
    selectedMatrix,
    setChordVariation,
    setScaleVariation,
    setSearchArray: handleSetSearchArray,
    toggleSelectedMatrix,
    setSelectedMatrix,
  };
};
