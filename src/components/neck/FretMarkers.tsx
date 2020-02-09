import * as React from "react"
import { times } from 'lodash';

export interface FretMarkersProps {
  markers: number[];
}

export class FretMarkers extends React.Component<FretMarkersProps, {}> {

  render() {
    const markers: JSX.Element[] = [];

    for (var m in this.props.markers) {
      let curMarkers: JSX.Element[] = [];

      times(this.props.markers[m], () => curMarkers.push(<div className="marker"></div>));
      markers.push(<div className="fret-marker">{curMarkers}</div>)
    }

    return (
      <div className="fret-marker-group">
        {markers}
      </div>
    );
  }
  
}