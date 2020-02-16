import * as React from 'react';
import { times } from 'lodash';

import { FretMode } from './Fret';
import { FretNumbers } from "./FretNumbers";
import { FretMarkers } from "./FretMarkers";
import { StringComponent } from "./String";

import { Key } from '../../models/Key';
import { Mode } from '../../models/Mode';
import { Tuning } from "../../models/Tuning";
import { Scale } from "../../models/Scale";

export interface NeckProps {
  musicKey: Key;
  tuning: Tuning;
  mode: Mode;
  frets?: number;
  strings?: number;
  markers?: number[];
  fretmode?: FretMode;
}

export const Neck: React.FunctionComponent<NeckProps> = ({
  musicKey,
  tuning,
  mode,
  frets = 12,
  strings = 6,
  markers = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2],
  fretmode = FretMode.Note
}) => {
  const [curFrets, setFrets] = React.useState<number>(frets);
  const [curStrings, setStrings] = React.useState<number>(strings);
  const [curMarkers, setMarkers] = React.useState<number[]>(markers);
  const [curTuning, setTuning] = React.useState<Tuning>(tuning);
  const [curMode, setMode] = React.useState<FretMode>(fretmode);

  const calcScale = (key: Key) => {
    return new Scale(key.Root, mode);
  }

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
          <StringComponent key={i} mode={curMode} frets={curFrets} scale={calcScale(musicKey)} offset={curTuning.Offsets[i]} />
        )}
      </div>
    </div>
  )
}