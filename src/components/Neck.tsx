import * as React from "react"

import { FretLabels } from "./neck/FretLabels";
import { FretMarkers } from "./neck/FretMarkers";
import { String } from "./neck/String";

export interface NeckProps {
  frets?: number;
  strings?: number;
}

export interface NeckState {
  frets: number;
  strings: number;
}

const NUM_FRETS = 12;
const NUM_STRINGS = 6;

const defaultFrets = (props: NeckProps) => props.frets || NUM_FRETS;
const defaultStrings = (props: NeckProps) => props.strings || NUM_STRINGS;

export class Neck extends React.Component<NeckProps, {}> {
  readonly state = {
    frets: defaultFrets(this.props),
    strings: defaultStrings(this.props),
  };

  render() {
    let strings = [];
    
    for (var i = 0; i < this.state.strings; i++) {
      strings.push(<String frets={this.state.frets} />);
    }

    return (
      <>
        <div className="neck">
          <div className="backdrop">
            <div className="fretboard-labels">
              <FretLabels options="home.options.labels" />
              <FretLabels options="home.options.labels" />
            </div>
            <div className="fretboard-markers">
              <FretMarkers options="home.options.markers" />
            </div>
          </div>
          <div className="strings">
            {strings}
          </div>
        </div>
      </>
    );
  }
}