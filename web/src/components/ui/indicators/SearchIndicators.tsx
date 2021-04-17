import { map, times } from 'lodash';
import * as React from 'react';
import { FretIndicator } from '.';
import { useIndicatorsContext } from '../..';
import { useAppOptionsContext } from '../../..';
import { FretNote, TuningNote } from '../../../models';
import { FretDisplayMode } from '../../neck';

export interface SearchIndicatorsProps {}

export const SearchIndicators: React.FunctionComponent<SearchIndicatorsProps> = () => {
  const { appOptions } = useAppOptionsContext();
  const { indicatorsDisplayMode, instrument, tuning } = appOptions;
  const {
    fretMap,
    selectedMatrix,
    toggleSelectedMatrix,
  } = useIndicatorsContext();

  // TODO: HACK
  const skip = selectedMatrix?.length != instrument?.NumStrings;

  return (
    <>
      {map(tuning?.Offsets, (o: TuningNote, s: number) => {
        return (
          <div className="string" key={s}>
            {times(instrument.NumFrets + 1, (f) => {
              // TODO: HACK
              const selected = skip
                ? false
                : !!selectedMatrix && !!selectedMatrix[s][f];

              const getLabel = (note: FretNote): React.ReactElement => {
                switch (indicatorsDisplayMode) {
                  case FretDisplayMode.Degree:
                    return <>{note?.Note?.Degree}</>;
                  case FretDisplayMode.Marker:
                    return <span></span>;
                  case FretDisplayMode.Note:
                    return <>{note?.Label}</>;
                }
              };

              return (
                <FretIndicator
                  key={f}
                  show={true}
                  toggle={true}
                  pitch={fretMap?.Notes[s][f]?.Pitch || 4}
                  root={fretMap?.Notes[s][f]?.Root}
                  onClick={() => toggleSelectedMatrix(s, f)}
                  label={selected ? getLabel(fretMap.Notes[s][f]) : null}
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
