import * as React from "react"
import { map, times } from 'lodash';

export interface FretMarkersProps {
  markers: number[];
}

export const FretMarkers: React.FunctionComponent<FretMarkersProps> = ({ markers }) => {
  return (
    <div className="fret-marker-container">
      {map(markers, (m, i) =>
        <div className="fret-marker-group" key={i}>
          {times(m, (i) => <div className="marker" key={i}></div>)}
        </div>
      )}
    </div>
  )
}