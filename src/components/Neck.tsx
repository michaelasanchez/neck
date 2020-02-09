import * as React from "react"

import { FretLabels } from "./neck/FretLabels";
import { FretMarkers } from "./neck/FretMarkers";
import { String } from "./neck/String";

export interface NeckProps { }

export class Neck extends React.Component<NeckProps, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="neck">
          <div className="other">
            <div className="fretboard-labels">
              <FretLabels options="home.options.labels" />
              <FretLabels options="home.options.labels" />
            </div>
            <div className="fretboard-markers">
              <FretMarkers options="home.options.markers" />
            </div>
          </div>
          <div className="strings">
            <String model="model.strings[$index]" scale="model.scale" />
          </div>
        </div>
      </>
    );
  }
}