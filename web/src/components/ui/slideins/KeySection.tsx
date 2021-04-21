import * as React from 'react';
import { Ring } from '.';
import { Key } from '../../../models';

interface KeySectionProps {
  active?: boolean;
  ring: Ring;
  sectionNum: number;
  musicKey: Key;
  radius: number;
  setKey: (key: Key) => void;
}

export const KeySection: React.FunctionComponent<KeySectionProps> = (props) => {
  const {
    active = false,
    ring,
    sectionNum,
    musicKey: key,
    radius,
    setKey,
  } = props;
  const section = ring.sections[sectionNum];

  return (
    <div
      className={`key${active ? ' active' : ''}`}
      key={sectionNum}
      style={{
        top: `${section.center.y + radius}px`,
        left: `${section.center.x + radius}px`,
      }}
      onClick={() => setKey(key)}
    >
      <svg>
        <path
          d={`M${section.innerStart.x},${section.innerStart.y} L${section.outerStart.x},${section.outerStart.y} A${ring.outerRadius},${ring.outerRadius} 1 0,1 ${section.outerEnd.x},${section.outerEnd.y} L${section.innerEnd.x},${section.innerEnd.y} A${ring.innerRadius},${ring.innerRadius} 1 0,0 ${section.innerStart.x},${section.innerStart.y} z`}
        ></path>
      </svg>
      <div>{key.Label}</div>
    </div>
  );
};
