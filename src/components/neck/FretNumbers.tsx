import { times } from 'lodash';
import * as React from 'react';
import { styles } from '../../shared';

export const FRET_NUMBERS_VISIBLE = [3, 5, 7, 9];

export enum FretNumbersMode {
  None = 0,
  Left = 1,
  Right = 2,
  Both = 3,
}

export const FRET_NUMBERS_MODE = FretNumbersMode.Left;

export interface FretNumbersProps {
  frets: number;
  mode?: FretNumbersMode;
  visible?: number[];
}

export const FretNumbers: React.FunctionComponent<FretNumbersProps> = ({
  frets,
  mode = FRET_NUMBERS_MODE,
  visible = FRET_NUMBERS_VISIBLE,
}) => {
  const renderNumberGroup = (
    <div className="fret-number-group" style={styles.fretNumberGroup}>
      <div className="fret-number open"></div>
      {times(frets, (i) => (
        <div className="fret-number" key={i}>
          {visible.indexOf(i + 1) >= 0 && i + 1}
        </div>
      ))}
    </div>
  );

  const renderGroups = (): JSX.Element => {
    switch (mode) {
      case FretNumbersMode.None:
        return null;
      case FretNumbersMode.Left:
      case FretNumbersMode.Right:
        return <>{renderNumberGroup}</>;
      case FretNumbersMode.Both:
        return (
          <>
            {renderNumberGroup}
            {renderNumberGroup}
          </>
        );
    }
  };

  return (
    <div
      className={`fretboard-numbers${
        mode == FretNumbersMode.Right ? ' right' : ''
      }`}
      style={styles.fretNumbers}
    >
      {renderGroups()}
    </div>
  );
};
