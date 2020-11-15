import * as React from 'react';
import { map, times } from 'lodash';

export interface FretMarkersProps {
  markers: number[];
}

export const FretMarkers: React.FunctionComponent<FretMarkersProps> = ({
  markers,
}) => {
  return (
    <>
      <div className="fretboard-marker-group open"></div>
      {map(markers, (m, i) => (
        <div className="fretboard-marker-group" key={i}>
          {times(m, (j) => (
            <div className="fretboard-marker" key={j}></div>
          ))}
        </div>
      ))}
    </>
  );
};
