import React = require('react');
import { size, map, each, keyBy, isArray, uniq } from 'lodash';
import Slider from 'rc-slider';
import { Key } from '../../models';
import { useState } from 'react';
import { Keys } from '../../shared';

const DEFAULT_INDEX_SHIFT = 3;
const DEFAULT_INCLUDE_THEORETICAL = true;

export interface KeySliderProps {
  setKey?: (key: Key) => void;
}

// const style = {
//   float: 'left',
//   width: 160,
//   height: 400,
//   marginBottom: 160,
//   marginLeft: 50,
// };
// const parentStyle = { overflow: 'hidden' };

interface SliderValues {
  [key: number]: string;
}

const shiftIndex = (index: number, shift: number, total: number) => {
  return (shift + index + total) % total;
};

const sliderVals = Keys.SliderValues();
const numSliderVals = size(sliderVals);

let marks: SliderValues = {};
each(sliderVals, (x: Key[], i: string) => {
  const label = map(x, (k: Key) => k.Label).join(' / ');
  const key = shiftIndex(parseInt(i), DEFAULT_INDEX_SHIFT, numSliderVals);

  marks[key] = label;
});

export const KeySlider: React.FunctionComponent<KeySliderProps> = ({
  setKey,
}) => {
  const [secondaryIndex, setSecondaryIndex] = useState<number | null>();

  const handleChange = (primaryIndex: number) => {
    const index = shiftIndex(primaryIndex, -DEFAULT_INDEX_SHIFT, numSliderVals);
    const keys = sliderVals[index];

    let nextKey;
    let nextSecondaryIndex = null;  // keep for comparison around #68

    if (keys.length > 1) {
      if (secondaryIndex !== null) {
        nextSecondaryIndex = shiftIndex(secondaryIndex, 1, keys.length);
      } else {
        nextSecondaryIndex = 0;
      }
    } else {
      nextKey = keys[0];
      if (secondaryIndex !== null) {
        nextSecondaryIndex = null;
      }
    }

    if (secondaryIndex !== nextSecondaryIndex) {
      setSecondaryIndex(nextSecondaryIndex);

      if (nextSecondaryIndex !== null) {
        nextKey = keys[nextSecondaryIndex];
      }
    }

    setKey && nextKey && setKey(nextKey);
  };

  React.useEffect(() => {}, []);

  return (
    <Slider
      vertical
      reverse={true}
      min={0}
      max={size(marks) - 1}
      marks={marks}
      step={null}
      defaultValue={3}
      included={false}
      onChange={handleChange}
    />
  );
};
