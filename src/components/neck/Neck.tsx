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
  numFrets?: number;
  numStrings?: number;
  markers?: number[];
  fretmode?: FretMode;
}

export const Neck: FunctionComponent<NeckProps> = ({
  musicKey,
  tuning,
  mode,
  numFrets = 12,
  numStrings = 6,
  markers = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 2],
  fretmode = FretMode.Note
}) => {

  const calcScale = (key: Key) => {
    return new Scale(key.Root, mode);
  }

  return (
    <div className="neck">
      <div className="backdrop">
        <div className="fretboard-numbers">
          <FretNumbers frets={numFrets} />
          <FretNumbers frets={numFrets} />
        </div>
        <div className="fretboard-markers">
          <FretMarkers markers={markers} />
        </div>
      </div>
      <div className="strings">
        {times(numStrings, (i) =>
          <StringComponent
            key={i}
            fretmode={fretmode}
            frets={numFrets}
            offset={tuning.Offsets[i]}
            scale={calcScale(musicKey)}
          />
        )}
      </div>
    </div>
  )
}