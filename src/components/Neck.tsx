import * as React from 'react';
import { times } from 'lodash';

import { FretNumbers } from "./neck/FretNumbers";
import { FretMarkers } from "./neck/FretMarkers";
import { StringComponent } from "./neck/String";

import { Scale } from "../models/Scale";
import { Note } from "../models/Note";
import { Mode } from "../models/Mode";
import { Tuning } from "../models/Tuning";
import { Key } from '../models/Key';
import { FretMode } from './neck/Fret';

export interface NeckProps {
  frets?: number;
  strings?: number;
  markers?: number[];
  tuning?: Tuning;
  test?: Key;
  mode?: FretMode;
}

export interface NeckState {
  frets: number;
  strings: number;
  markers: number[];
  scale: Scale;
  tuning: Tuning;
  test: Key;
  mode: FretMode;
}

const defaultProps: NeckProps = {
  frets: 12,
  strings: 6,
  markers: [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2],
  tuning: Tuning.Standard(),
  test: new Key(Note.C()),
  mode: FretMode.Note,
};

const Neck: React.FunctionComponent<NeckProps> = ({ frets, strings, markers, tuning, test, mode }) => {
  const [curFrets, setFrets] = React.useState<number>(frets);
  const [curStrings, setStrings] = React.useState<number>(strings);
  const [curMarkers, setMarkers] = React.useState<number[]>(markers);
  const [curTuning, setTuning] = React.useState<Tuning>(tuning)
  const [curScale, setScale] = React.useState<Scale>(new Scale(test.Root, Mode.Ionian()));
  const [curMode, setMode] = React.useState<FretMode>(mode);


  return (
    <div className="neck">
      <div className="backdrop">
        <div className="fretboard-numbers">
          <FretNumbers frets={curFrets} />
          <FretNumbers frets={curFrets} />
        </div>
        <div className="fretboard-markers">
          <FretMarkers markers={curMarkers} />
        </div>
      </div>
      <div className="strings">
        {times(curStrings, (i) =>
          <StringComponent mode={curMode} frets={curFrets} scale={curScale} offset={curTuning.Offsets[i]} />
        )}
      </div>
    </div>
  )
}

Neck.defaultProps = defaultProps;

export default Neck;