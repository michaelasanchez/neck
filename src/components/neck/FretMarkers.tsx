import * as React from "react"
import { each, forEach, times } from 'lodash';

export interface FretMarkersProps {
  markers: number[];
}

export class FretMarkers extends React.Component<FretMarkersProps, {}> {


  render() {
    const markerGroups: JSX.Element[] = [];

    // console.log(each(this.props.markers, (m) => {
    //   <div className="fret-marker">{times(m, _ => <div className="marker"></div>)}</div>
    // }))

    each(this.props.markers, (m) => {
      markerGroups.push(
        <div className="fret-marker-group">
          {times(m, _ => <div className="marker"></div>)}
        </div>
      );
    });

    // console.log(markerGroups);

    return (
      <div className="fret-marker-container">
        {markerGroups}
      </div>
    );
  }

}