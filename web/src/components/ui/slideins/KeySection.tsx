import { map } from 'lodash';
import * as React from 'react';
import { Ring } from '.';
import { Key } from '../../../models';

interface KeySectionProps {
  active?: boolean;
  activeIndex?: number;
  ring: Ring;
  sectionNum: number;
  keyGroup: Key[];
  radius: number;
  setKey: (key: Key) => void;
}

function intersperse(arr: any[], sep: any) {
  if (arr.length === 0) {
    return [];
  }

  return arr.slice(1).reduce(
    function (xs, x, i) {
      return xs.concat([sep, x]);
    },
    [arr[0]]
  );
}

export const KeySection: React.FunctionComponent<KeySectionProps> = (props) => {
  const {
    active = false,
    activeIndex,
    ring,
    sectionNum,
    keyGroup,
    radius,
    setKey,
  } = props;
  const section = ring.sections[sectionNum];

  // const getKeyIndex = (
  //   keyGroup: Key[],
  //   active: boolean,
  //   activeIndex: number
  // ): number => {
  //   return ;
  // };

  return (
    <div
      className={`key${active ? ' active' : ''}`}
      key={sectionNum}
      style={{
        top: `${section.center.y + radius}px`,
        left: `${section.center.x + radius}px`,
      }}
      onClick={() =>
        setKey(keyGroup[active ? (activeIndex + 1) % keyGroup.length : 0])
      }
    >
      <svg>
        <path
          d={`M${section.innerStart.x},${section.innerStart.y} L${section.outerStart.x},${section.outerStart.y} A${ring.outerRadius},${ring.outerRadius} 1 0,1 ${section.outerEnd.x},${section.outerEnd.y} L${section.innerEnd.x},${section.innerEnd.y} A${ring.innerRadius},${ring.innerRadius} 1 0,0 ${section.innerStart.x},${section.innerStart.y} z`}
        ></path>
      </svg>
      <div>
        {intersperse(
          map(keyGroup, (k, i) =>
            activeIndex === i ? <strong key={i}>{k.Label}</strong> : k.Label
          ),
          '/'
        )}
      </div>
    </div>
  );
};
