import { map, times } from 'lodash';
import * as React from 'react';
import { useAppOptionsContext } from '../../..';
import { Key } from '../../../models';
import { Keys } from '../../../shared';

export interface KeySelectorProps {}

interface Point {
  x: number;
  y: number;
}

interface Ring {
  center: Point;
  sections: Section[];
  innerRadius: number;
  // innerPoints: Point[];
  outerRadius: number;
  // outerPoints: Point[];
}

interface Section {
  center: Point;
  innerStart: Point;
  outerStart: Point;
  innerEnd: Point;
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

export const KeySelector: React.FunctionComponent<KeySelectorProps> = (
  props
) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { key } = appOptions;

  return (
    <div className="key-selector">
      <div className="current">
        <h3>{key.Label}</h3>
      </div>
      <div className="major">
        {map(Keys.Major(), (k: Key, i: number) => (
          <KeySection key={i} ring={outerRing} sectionNum={i} musicKey={k} />
        ))}
      </div>
      <div className="minor">
        {map(Keys.Minor(), (k: Key, i: number) => (
          <KeySection key={i} ring={innerRing} sectionNum={i} musicKey={k} />
        ))}
      </div>
    </div>
  );
};

interface KeySectionProps {
  active?: boolean;
  ring: Ring;
  sectionNum: number;
  musicKey: Key;
}

const KeySection: React.FunctionComponent<KeySectionProps> = (props) => {
  const { ring, sectionNum, musicKey: key, active = false } = props;
  const section = ring.sections[sectionNum];

  return (
    <div
      className="key"
      key={sectionNum}
      style={{
        top: `${section.center.y + radius}px`,
        left: `${section.center.x + radius}px`,
      }}
    >
      <svg>
        <path
          d={`M${section.innerStart.x},${section.innerStart.y} L${section.outerStart.x},${section.outerStart.y} A${ring.outerRadius},${ring.outerRadius} 1 0,1 ${section.outerEnd.x},${section.outerEnd.y} L${section.innerEnd.x},${section.innerEnd.y} A${ring.innerRadius},${ring.innerRadius} 1 0,0 ${section.innerStart.x},${section.innerStart.y} z`}
        ></path>
      </svg>
      <div>{key.Tonic.Label}</div>
    </div>
  );
};
