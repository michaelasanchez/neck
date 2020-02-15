import * as React from "react"
import { map, times } from 'lodash';

export interface FretMarkersProps {
  markers: number[];
}

export const FretMarkers: React.FunctionComponent<FretMarkersProps> = ({ markers }) => {
  return (
    <div className="fret-marker-container">
      {map(markers, (m) =>
        <div className="fret-marker-group">
          {times(m, () => <div className="marker"></div>)}
        </div>
      )}
    </div>
  )
}