import * as React from 'react';
import { times } from 'lodash';

export interface FretNumbersProps {
  frets: number;
}

const visible = [3, 5, 7, 9];

export const FretNumbers: React.FunctionComponent<FretNumbersProps> = ({
  frets,
}) => {
  return (
    <div className="fret-number-group">
      {times(frets, (i) => (
        <div className="fret-number" key={i}>
          {visible.indexOf(i + 1) >= 0 && i + 1}
        </div>
      ))}
    </div>
  );
};
