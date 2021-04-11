import { filter, findIndex, map, reduce, sum, times } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { FretIndicator, IndicatorsMode } from '.';
import { useIndicatorsContext } from '../..';
import { useAppOptionsContext } from '../../..';
import { FretMap, FretNote, Instrument, TuningNote } from '../../../models';

export interface SearchIndicatorsProps {}

const getEmptyMatrix = (instrument: Instrument, searchArray: FretNote[]) => {
  return times(instrument.NumStrings, (s) =>
    times(instrument.NumFrets, (f) =>
      filter(searchArray, (n) => n.String == s && n.Fret == f)?.length > 0
        ? true
        : false
    )
  );
};

export const SearchIndicators: React.FunctionComponent<SearchIndicatorsProps> = (
  props
) => {
  const { appOptions } = useAppOptionsContext();
  const { indicatorsMode: mode, instrument, tuning } = appOptions;
  const { fretMap, searchArray, setSearchArray } = useIndicatorsContext();

  const [selectedMatrix, setSelectedMatrix] = useState<boolean[][]>();

  // Reset search matrix
  useEffect(() => {
    if (mode === IndicatorsMode.Search) {
      setSelectedMatrix(getEmptyMatrix(instrument, searchArray));
    }
  }, []);

  useEffect(() => {
    const selected = sum(
      map(selectedMatrix, (s) =>
        reduce(s, (prev, curr, index) => prev + (curr ? 1 : 0), 0)
      )
    );
    if (!searchArray.length && !!selected) {
      setSelectedMatrix(getEmptyMatrix(instrument, searchArray));
    }
  }, [searchArray]);

  useEffect(() => {
    const mappedSearchArray = map(
      searchArray,
      (n: FretNote, i: number) => fretMap.Notes[n.String][n.Fret]
    );
    setSearchArray(mappedSearchArray);
  }, [fretMap]);

  const handleSetSelectedMatrix = (
    s: number,
    f: number,
    set: boolean = null
  ) => {
    const currentValue = selectedMatrix[s][f];
    const newValue = set === null ? !currentValue : set;
    selectedMatrix[s][f] = newValue;

    setSelectedMatrix([...selectedMatrix]);
    handleSetSearchArray(fretMap.Notes[s][f]);
  };

  const handleSetSearchArray = (note: FretNote) => {
    if (!!note) {
      const index = findIndex(
        searchArray,
        (n: FretNote) => n.String == note.String && n.Fret == note.Fret
      );
      index < 0 ? searchArray.push(note) : searchArray.splice(index, 1);
      setSearchArray(searchArray);
    } else {
    }
  };

  return (
    <>
      {map(tuning?.Offsets, (o: TuningNote, s: number) => {
        return (
          <div className="string" key={s}>
            {times(instrument.NumFrets + 1, (f) => {
              const selected = !!selectedMatrix && !!selectedMatrix[s][f];
              return (
                <FretIndicator
                  key={f}
                  show={true}
                  toggle={true}
                  onClick={() => handleSetSelectedMatrix(s, f)}
                  label={selected ? fretMap.Notes[s][f]?.Label : null}
                  indicatorClass={selected ? ' selected' : ''}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
};
