import * as React from "react"

import { Note } from "../../models/Note";
import { useState, useEffect } from "react";

export enum FretMode {
  Note,
  Degree,
  Marker
}

export interface FretProps {
  fretmode: FretMode;
  open?: boolean;
  note?: Note;
}

export const Fret: React.FunctionComponent<FretProps> = ({ fretmode, open, note }) => {

  const fretLabel = () => {
    if (note) {
      switch (fretmode) {
        case FretMode.Note:
          return <label>{note.Label}</label>;
        case FretMode.Degree:
          return <label>{note.Degree}</label>;
        case FretMode.Marker:
          return <div className="fret-symbol"></div>;
      }
    }
  }

  return (
    <>
    <div className={'fret' + (open === true ? ' open' : '')}>
      <div className="label prev">
        {(fretLabel())}
      </div>
        {/*
          <div className="label next">
            <label></label>
            <label></label>
            <div className="fret-symbol"></div>
          </div>
        */}
    </div>
    </>
  )
}