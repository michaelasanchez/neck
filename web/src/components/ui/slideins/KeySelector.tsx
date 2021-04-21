import { map, times } from 'lodash';
import * as React from 'react';
import { KeySection } from '.';
import { useAppOptionsContext } from '../../..';
import { Key } from '../../../models';
import { Keys } from '../../../shared';

export interface KeySelectorProps {}

interface Point {
  x: number;
  y: number;
}

export interface Ring {
  center: Point;
  innerRadius: number;
  outerRadius: number;
  sections: Section[];
}

interface Section {
  center: Point;
  innerStart: Point;
  innerEnd: Point;
  outerStart: Point;
  outerEnd: Point;
}

const calcPoint = (center: Point, radians: number, radius: number): Point => {
  return {
    x: -center.x + Math.sin(radians) * radius,
    y: -center.y + -Math.cos(radians) * radius,
  };
};

const calcRing = (
  ringCenter: Point,
  innerRadius: number,
  outerRadius: number,
  numSections: number
): Ring => {
  const sectionRadians = (2 * Math.PI) / numSections;
  const halfSectionRadians = sectionRadians / 2;
  const midRadius = (outerRadius + innerRadius) / 2;

  const sections = times(numSections, (i) => {
    const startRadian = sectionRadians * i - halfSectionRadians;

    const midpoint = startRadian + halfSectionRadians;
    const endRadian = startRadian + sectionRadians;

    const sectionCenter = calcPoint(ringCenter, midpoint, midRadius);

    return {
      center: sectionCenter,
      innerStart: calcPoint(sectionCenter, startRadian, innerRadius),
      outerStart: calcPoint(sectionCenter, startRadian, outerRadius),
      innerEnd: calcPoint(sectionCenter, endRadian, innerRadius),
      outerEnd: calcPoint(sectionCenter, endRadian, outerRadius),
    };
  });

  return {
    center: ringCenter,
    sections,
    innerRadius,
    outerRadius,
  };
};

const radius = 200;
const center = { x: 0, y: 0 };
const innerRing = calcRing(center, radius / 3, (2 * radius) / 3, 12);
const outerRing = calcRing(center, (2 * radius) / 3, radius, 12);

interface KeyMap {
  [key: string]: { keys: Key[]; ring: Ring };
}

const keys: KeyMap = {
  major: { keys: Keys.Major(), ring: outerRing },
  minor: { keys: Keys.Minor(), ring: innerRing },
};

export const KeySelector: React.FunctionComponent<KeySelectorProps> = (
  props
) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { key } = appOptions;

  return (
    <div className="key-selector">
      {map(keys, (keyObj: { keys: Key[]; ring: Ring }, label: string) => (
        <div className={label} key={label}>
          {map(keyObj.keys, (k: Key, i: number) => (
            <KeySection
              active={key.Label == k.Label}
              key={i}
              ring={keyObj.ring}
              sectionNum={i}
              musicKey={k}
              radius={radius}
              setKey={(key: Key) => setAppOptions({ key })}
            />
          ))}
        </div>
      ))}
      <div className="current">
        <h2>{key.Label}</h2>
      </div>
    </div>
  );
};
