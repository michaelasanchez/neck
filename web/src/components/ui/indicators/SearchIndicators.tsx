import { each, filter, findIndex, map, times } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { FretIndicator, FretMap, IndicatorsMode } from '.';
import { useIndicatorsContext } from '../..';
import { useAppOptionsContext } from '../../..';
import { Instrument, Note, Tuning, TuningNote } from '../../../models';
import { NoteUtils } from '../../../shared';

export interface SearchIndicatorsProps {
  fretMap: FretMap;
}

export const SearchIndicators: React.FunctionComponent<SearchIndicatorsProps> = (props) => {
  const { appOptions } = useAppOptionsContext();
  const { indicatorsMode: mode, instrument, key, tuning } = appOptions;
  const { searchArray, setIndicatorsOptions } = useIndicatorsContext();
  const { fretMap } = props;

  const [selectedMatrix, setSelectedMatrix] = useState<boolean[][]>();

  // Reset search matrix
  useEffect(() => {
    if (mode === IndicatorsMode.Search) {

      const matrix = times(instrument.NumStrings, (s) =>
        times(instrument.NumFrets, (f) => false)
      );
      setSelectedMatrix(matrix);
    }
  }, [mode]);

  useEffect(() => {
    // TODO: Need to translate search array to new key
    console.log('search array', searchArray);
  }, [key]);

  const handleSetSelectedMatrix = (s: number, f: number, set: boolean = null) => {
    const currentValue = selectedMatrix[s][f];
    const newValue = set === null ? !currentValue : set;
    selectedMatrix[s][f] = newValue;

    setSelectedMatrix([...selectedMatrix]);
    handleSetSearchArray(fretMap[s][f]);
  };

  const handleSetSearchArray = (note: TuningNote) => {
    if (!!note) {
      const index = findIndex(searchArray, (n: TuningNote) => n.Pitch == note.Pitch);
      index < 0 ? searchArray.push(note) : searchArray.splice(index, 1);
      setIndicatorsOptions({ searchArray: [...searchArray] });
    } else {
    }
  }

  return <>
    {map(tuning.Offsets, (o: Note, s: number) => {
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
                label={selected ? fretMap[s][f]?.Label : null}
                indicatorClass={
                  selected ? ' degree-1' : ''
                }
              />
            );
          })}
        </div>
      );
    })}
  </>
}