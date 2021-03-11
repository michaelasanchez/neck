import * as React from 'react';
import { map, min, times } from 'lodash';

export interface FretMarkersProps {
  frets: number;
  markers: number[];
}

export const FretMarkers: React.FunctionComponent<FretMarkersProps> = ({
  frets,
  markers,
}) => {
  return (
    <>
      <div className="fretboard-marker-group open"></div>
      {times(min([frets, markers.length]), (i) => (
        <div className="fretboard-marker-group" key={i}>
          {times(markers[i], (j) => (
            <div className="fretboard-marker" key={j}></div>
          ))}
        </div>
      ))}
    </>
  );
};
