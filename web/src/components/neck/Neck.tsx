import { times } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { StringComponent } from '.';
import { Key, Mode, Scale } from '../../models';
import { IAppOptions, styles } from '../../shared';

export const ENABLE_NECK_ANIMATION = true;

export interface NeckProps {
  options?: IAppOptions;
}

const getScale = (key: Key, mode: Mode) => new Scale(key.Tonic, mode);

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
      const diff = nextRoot?.Modified - root?.Modified;

      // Default to up when equidistant
      if ((diff < 0 && diff < -6) || (diff > 0 && diff < 6)) {
        setClassName('down');
      } else {
        setClassName('up');
      }
    }
  }, [key, mode]);

  return (
    <div className="neck" style={styles.neck}>
      <div className={`neck-strings ${className}`}>
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
