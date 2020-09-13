import { times } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StringComponent } from '.';
import { IOptions, Key, Mode, Scale } from '../../models';

export const ENABLE_NECK_ANIMATION = true;

export interface NeckProps {
  options?: IOptions;
}

const getScale = (key: Key, mode: Mode) => new Scale(key.Root, mode);

export const Neck: React.FunctionComponent<NeckProps> = ({ options }) => {
  const { key, tuning, mode, numFrets, markers, fretMode } = options;

  const [scale, setScale] = useState<Scale>(getScale(key, mode));
  const [className, setClassName] = useState<string>();

  useEffect(() => {
    const nextScale = getScale(key, mode);
    setScale(nextScale);

    const root = scale?.Root;
    const nextRoot = nextScale?.Root;

    // Fret Animation
    if (ENABLE_NECK_ANIMATION) {
      const diff = nextRoot.Modified - root.Modified;

      // Default to up when equidistant
      if ((diff < 0 && diff < -6) || (diff > 0 && diff < 6)) {
        setClassName('down');
      } else {
        setClassName('up');
      }
    }
  }, [key, mode]);

  return (
    <div className="neck">
      <div className={`strings ${className}`}>
        {times(tuning.Offsets.length, (i) => (
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
