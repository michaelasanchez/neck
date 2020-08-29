import { times } from 'lodash';
import * as React from 'react';
import { FretMarkers, FretDisplayMode, FretNumbers, StringComponent } from '.';
import { IOptions, Key, Scale, Mode } from '../../models';
import { useEffect, useState } from 'react';

const ENABLE_NECK_ANIMATION = true;

export interface NeckProps {
  options?: IOptions;
}

const getScale = (key: Key, mode: Mode) => new Scale(key.Root, mode);

export const Neck: React.FunctionComponent<NeckProps> = ({
  options,
}) => {
  const { key, tuning, mode, numFrets, numStrings, markers, fretMode } = options;

  const [scale, setScale] = useState<Scale>(getScale(key, mode));
  const [className, setClassName] = useState<string>();

  useEffect(() => {
    const nextScale = getScale(key, mode);
    setScale(nextScale);

    if (ENABLE_NECK_ANIMATION) {
      if (nextScale?.Root.Modified > scale?.Root.Modified) {
        setClassName('down');
      } else {
        setClassName('up');
      }
    }
  }, [key, mode]);

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
      <div className={`strings ${className}`}>
        {times(numStrings, (i) => (
          <StringComponent
            key={i}
            fretmode={fretMode}
            frets={numFrets}
            offset={tuning.Offsets[i]}
            scale={scale}
          />
        ))}
      </div>
    </div>
  );
};
