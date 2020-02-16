import * as React from 'react';
import { FunctionComponent, useState } from 'react';
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

export const Neck: FunctionComponent<NeckProps> = ({
  musicKey,
  tuning,
  mode,
  frets = 12,
  strings = 6,
  markers = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2],
  fretmode = FretMode.Note
}) => {
  const [curFrets, setFrets] = useState<number>(frets);
  const [curStrings, setStrings] = useState<number>(strings);
  const [curMarkers, setMarkers] = useState<number[]>(markers);
  const [curTuning, setTuning] = useState<Tuning>(tuning);
  const [curMode, setMode] = useState<FretMode>(fretmode);

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
          <StringComponent
            key={i}
            mode={curMode}
            frets={curFrets}
            offset={curTuning.Offsets[i]}
            scale={calcScale(musicKey)}
          />
        )}
      </div>
    </div>
  )
}