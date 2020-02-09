import * as React from "react"

import { FretLabels } from "./neck/FretLabels";
import { FretMarkers } from "./neck/FretMarkers";
import { String } from "./neck/String";

export interface NeckProps {
  frets?: number;
  strings?: number;
  markers?: number[];
}

export class Neck extends React.Component<NeckProps, {}> {
  public static defaultProps = {
    frets: 12,
    strings: 6,
    markers: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2],
  };

  render() {
    let strings: JSX.Element[] = [];
    for (var i = 0; i < this.props.strings; i++) {
      strings.push(<String frets={this.props.frets} />);
    }

    return (
      <div className="neck">
        <div className="backdrop">
          <div className="fretboard-labels">
            <FretLabels frets={this.props.frets} />
            <FretLabels frets={this.props.frets} />
          </div>
          <div className="fretboard-markers">
            <FretMarkers markers={this.props.markers} />
          </div>
        </div>
        <div className="strings">
          {strings}
        </div>
      </div>
    );
  }
}