import * as React from 'react';
import { times } from 'lodash';

export interface FretNumbersProps {
  frets: number;
}

export const FretNumbers: React.FunctionComponent<FretNumbersProps> = ({
  frets,
}) => {
  return (
    <div className="fret-number-group">
      {times(frets, (i) => (
        <div className="label" key={i}>
          {i + 1}
        </div>
      ))}
    </div>
  );
};
