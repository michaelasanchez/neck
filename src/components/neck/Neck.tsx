import { times } from "lodash";
import * as React from "react";
import { FretMarkers, FretMode, FretNumbers, StringComponent } from ".";
import { IOptions, Key, Scale } from "../../models";

export interface NeckProps {
  options?: IOptions;
  fretmode?: FretMode;
}

export const Neck: React.FunctionComponent<NeckProps> = ({
  options,
  fretmode = FretMode.Note,
}) => {
  const {
    key,
    tuning,
    mode,
    numFrets,
    numStrings,
    markers,
  } = options;

  const calcScale = (key: Key) => {
    return new Scale(key.Root, mode);
  };

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
        {times(numStrings, (i) => (
          <StringComponent
            key={i}
            fretmode={fretmode}
            frets={numFrets}
            offset={tuning.Offsets[i]}
            scale={calcScale(key)}
          />
        ))}
      </div>
    </div>
  );
};
