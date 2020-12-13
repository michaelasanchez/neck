import { times } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { StringComponent } from '.';
import { Key, Mode, Scale } from '../../models';
import { AppOptions, styles } from '../../shared';
import { FretDisplayMode } from './Fret';

export const ENABLE_NECK_ANIMATION = true;

// const STATIC_FRET_DISPLAY_MODE = FretDisplayMode.Note;

export interface NeckProps {
  options?: AppOptions;
}

const getScale = (key: Key, mode: Mode) => new Scale(key.Tonic, mode);

export const Neck: React.FunctionComponent<NeckProps> = ({ options }) => {
  // TODO: static
  let fretDisplayMode = FretDisplayMode.Note;

  const { key, tuning, mode, instrument } = options;

  const [scale, setScale] = useState<Scale>(getScale(key, mode));
  const [className, setClassName] = useState<string>();

  useEffect(() => {
    const nextScale = getScale(key, mode);
    setScale(nextScale);

    const root = scale?.Tonic;
    const nextRoot = nextScale?.Tonic;

    // Fret Animation
    if (ENABLE_NECK_ANIMATION) {
      const diff = nextRoot?.Modified - root?.Modified;

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
        {tuning && times(tuning.Offsets.length, (i) => (
          <StringComponent
            key={i}
            fretmode={fretDisplayMode}
            frets={instrument.NumFrets}
            offset={tuning.Offsets[i]}
            scale={scale}
          />
        ))}
      </div>
    </div>
  );
};
