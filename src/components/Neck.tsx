import * as React from 'react';
import { times } from 'lodash';

import { FretNumbers } from "./neck/FretNumbers";
import { FretMarkers } from "./neck/FretMarkers";
import { String } from "./neck/String";

import { Scale } from "../models/Scale";
import { Note } from "../models/Note";
import { Mode } from "../models/Mode";
import { Tuning } from "../models/Tuning";
import { Key } from '../models/Key';

export interface NeckProps {
  frets?: number;
  strings?: number;
  markers?: number[];
  tuning?: Tuning;
  test?: Key;
}

export interface NeckState {
  frets: number;
  strings: number;
  markers: number[];
  scale: Scale;
  tuning: Tuning;
  test: Key;
}

export class Neck extends React.Component<NeckProps, NeckState> {
  public static defaultProps = {
    frets: 12,
    strings: 6,
    markers: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2],
    tuning: Tuning.Standard(),
    test: Note.C(),
  };

  constructor(props: NeckProps) {
    super(props);

    this.state = {
      frets: this.props.frets,
      strings: this.props.strings,
      markers: this.props.markers,
      scale: new Scale(this.props.test.Root, Mode.Ionian()),
      tuning: this.props.tuning,
      test: this.props.test,
    } as NeckState;
  }

  renderFretNumbers() {
    return (
      <div className="fret-number-group">
        {times(this.state.frets, (i) =>
          <div className="label">{i + 1}</div>
        )}
      </div>
    )
  }

  renderStrings() {
    return (
      <div className="strings">
        {times(this.state.strings, (i) =>
          <String frets={this.state.frets} scale={this.state.scale} offset={this.state.tuning.Offsets[i]} />
        )}
      </div>
    );
  }

  render() {
    console.log('hm', this.state);
    return (
      <div className="neck">
        <div className="backdrop">
          <div className="fretboard-numbers">
            <FretNumbers frets={this.state.frets} />
            <FretNumbers frets={this.state.frets} />
          </div>
          <div className="fretboard-markers">
            <FretMarkers markers={this.state.markers} />
          </div>
        </div>
        {this.renderStrings()}
      </div>
    );
  }
}