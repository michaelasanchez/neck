import { filter, map, times } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { FretIndicator, FretMap, IndicatorsMode } from '.';
import { useIndicatorsContext } from '../..';
import { Instrument, Note, Tuning, TuningNote } from '../../../models';
import { NoteUtils } from '../../../shared';

export interface SearchIndicatorsProps {
  fretMap: FretMap;
  indicatorsMode: IndicatorsMode;
  instrument: Instrument;
  tuning: Tuning;
}

export const SearchIndicators: React.FunctionComponent<SearchIndicatorsProps> = (props) => {
  const { searchArray, setIndicatorsOptions } = useIndicatorsContext();
  const { fretMap, indicatorsMode: mode, instrument, tuning } = props;

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

  const handleSetSelectedMatrix = (s: number, f: number, set: boolean = null) => {
    const currentValue = selectedMatrix[s][f];
    const newValue = set === null ? !currentValue : set;
    selectedMatrix[s][f] = newValue;

    setSelectedMatrix([...selectedMatrix]);
    handleSetSearchArray(fretMap[s][f]);
  };

  const handleSetSearchArray = (note: TuningNote) => {
    const found = filter(searchArray, n => NoteUtils.NotesAreEqual(n, note));
    if (!found.length) {
      const test = {
        searchArray: [...searchArray, note],
      };
      console.log('we gon set this', test)
      setIndicatorsOptions(test);
    }
  }

  return <>
    {map(tuning.Offsets, (o: Note, s: number) => {
      return (
        <div className="string" key={s}>
          {times(instrument.NumFrets + 1, (f) => {
            return (
              <FretIndicator
                key={f}
                show={true}
                toggle={true}
                onClick={() => handleSetSelectedMatrix(s, f)}
                indicatorClass={
                  !!selectedMatrix && !!selectedMatrix[s][f] ? ' degree-1' : ''
                }
              />
            );
          })}
        </div>
      );
    })}
  </>
}