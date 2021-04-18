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
  innerRadius: number;
  innerPoints: Point[];
  outerRadius: number;
  outerPoints: Point[];
}

const calcPoint = (
  centerX: number,
  centerY: number,
  radians: number,
  radius: number
): Point => {
  return {
    x: centerX + Math.sin(radians) * radius,
    y: centerY + -Math.cos(radians) * radius,
  };
};

const calcRing = (
  center: Point,
  innerRadius: number,
  outerRadius: number,
  slices: number
): Ring => {
  const radians = (2 * Math.PI) / slices;
  const inner: Point[] = [];
  const outer: Point[] = [];
  times(slices, (i) => {
    const r = radians * i;
    inner.push(calcPoint(center.x, center.y, r, innerRadius));
    outer.push(calcPoint(center.x, center.y, r, outerRadius));
  });
  return {
    center,
    innerRadius,
    innerPoints: inner,
    outerRadius,
    outerPoints: outer,
  };
};

const ring = calcRing({ x: 0, y: 0 }, 200 / 3, 200, 12);
console.log(ring);

export const KeySelector: React.FunctionComponent<KeySelectorProps> = (
  props
) => {
  const { appOptions } = useAppOptionsContext();
  const { key } = appOptions;

  return (
    <div className="key-selector">
      <div className="current">{key.Label}</div>
      <div className="key">
        <svg>
          <path
            d={`M${ring.innerPoints[0].x},${ring.innerPoints[0].y} L${ring.outerPoints[0].x},${ring.outerPoints[0].y} A${ring.outerRadius},${ring.outerRadius} 1 0,1 ${ring.outerPoints[1].x},${ring.outerPoints[1].y} L${ring.innerPoints[1].x},${ring.innerPoints[1].y} A${ring.innerRadius},${ring.innerRadius} 1 0,0 ${ring.innerPoints[0].x},${ring.innerPoints[0].y} z`}
          ></path>
        </svg>
      </div>
    </div>
  );
};
