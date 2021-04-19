import { times } from 'lodash';
import * as React from 'react';
import { useAppOptionsContext } from '../../..';

export interface KeySelectorProps {}

interface Point {
  x: number;
  y: number;
}

interface Ring {
  center: Point;
  sections: Section[];
  innerRadius: number;
  innerPoints: Point[];
  outerRadius: number;
  outerPoints: Point[];
}

interface Section {
  // center: Point;
  // innerRadius: number;
  // outerRadius: number;
  innerStart: Point;
  outerStart: Point;
  innerEnd: Point;
  outerEnd: Point;
}

const calcPoint = (center: Point, radians: number, radius: number): Point => {
  return {
    x: center.x + Math.sin(radians) * radius,
    y: center.y + -Math.cos(radians) * radius,
  };
};

const calcRing = (
  center: Point,
  innerRadius: number,
  outerRadius: number,
  numSections: number
): Ring => {
  const sectionRadians = (2 * Math.PI) / numSections;
  const midRadius = outerRadius - innerRadius;

  // const radians: number[] = [];
  const inner: Point[] = [];
  const outer: Point[] = [];

  times(numSections, (i) => {
    const r = sectionRadians * i;

    const midRadians = r + sectionRadians / 2;

    const sectionCenter = {
      x: Math.sin(midRadians) * midRadius,
      y: -Math.cos(midRadians) * midRadius,
    };

    const iPoint = calcPoint(center, r, innerRadius);
    const oPoint = calcPoint(center, r, outerRadius);

    console.log(iPoint,oPoint)

    // radians.push(r);
    inner.push(iPoint);
    outer.push(oPoint);
  });

  const sections = times(numSections, (i) => {
    const c = i;
    const n = c >= outer.length - 1 ? (c + 1) % outer.length : c + 1;

    return {
      // center: sectionCenter,
      innerStart: inner[c],
      outerStart: outer[c],
      innerEnd: inner[n],
      outerEnd: outer[n],
    };
  });

  return {
    center,
    sections,
    innerRadius,
    innerPoints: inner,
    outerRadius,
    outerPoints: outer,
  };
};

const center = { x: 0, y: 0 };
const innerRing = calcRing(center, 200 / 3, 400 / 3, 12);
const outerRing = calcRing(center, 400 / 3, 200, 12);

const renderSection = (ring: Ring, section: number) => (
  <div className="key">
    what
    <svg>{renderSectionPath(ring, section)}</svg>
  </div>
);

const renderSectionPath = (ring: Ring, current: number) => {
  const next =
    current >= ring.outerPoints.length - 1
      ? (current + 1) % ring.outerPoints.length
      : current + 1;

  console.log(ring.sections[current]);
  const section = ring.sections[current];
  return (
    <path
      d={`M${section.innerStart.x},${section.innerStart.y} L${section.outerStart.x},${section.outerStart.y} A${ring.outerRadius},${ring.outerRadius} 1 0,1 ${section.outerEnd.x},${section.outerEnd.y} L${section.innerEnd.x},${section.innerEnd.y} A${ring.innerRadius},${ring.innerRadius} 1 0,0 ${section.innerStart.x},${section.innerStart.y} z`}
    ></path>
  );
};

export const KeySelector: React.FunctionComponent<KeySelectorProps> = (
  props
) => {
  const { appOptions } = useAppOptionsContext();
  const { key } = appOptions;

  return (
    <div className="key-selector">
      <div className="current">{key.Label}</div>
      {renderSection(innerRing, 0)}
      {renderSection(outerRing, 2)}
    </div>
  );
};
