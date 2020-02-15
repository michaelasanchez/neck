import * as React from "react"

import { Note } from "../../models/Note";

export interface FretProps {
  mode: FretMode;
  open?: boolean;
  note?: Note;
}

export enum FretMode {
  Note,
  Degree,
  Marker
}

export class Fret extends React.Component<FretProps, {}> {
  public static defaultProps = {
    open: false,
    mode: FretMode.Note,
  };

  render() {
    let fretLabel: any;
    if (this.props.note) {
      switch (this.props.mode) {
        case FretMode.Note:
          fretLabel = <label>{this.props.note.Label}</label>;
          break;
        case FretMode.Degree:
          fretLabel = <label>{this.props.note.Degree}</label>;
          break;
        case FretMode.Marker:
          fretLabel = <div className="fret-symbol"></div>;
          break;
      }
    }

    return (
      <div className={'fret' + (this.props.open === true ? ' open' : '')}>
        <div className="label prev">
          {fretLabel}
        </div>
        {/* <div className="label next">
          <label></label>
          <label></label>
          <div className="fret-symbol"></div>
        </div> */}
      </div>
    );
  }
}