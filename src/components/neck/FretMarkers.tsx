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
      {map(markers, (m, i) => (
        <div className="fret-marker-group" key={i}>
          {times(m, (j) => (
            <div className="fret-marker" key={j}></div>
          ))}
        </div>
      ))}
    </>
  );
};
