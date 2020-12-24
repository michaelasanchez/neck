import * as React from 'react';

import { SlideIn } from '.';

export interface IScaleSlideInProps {}

export const ScaleSlideIn: React.FC<IScaleSlideInProps> = ({}) => {
  return <SlideIn loading={false}></SlideIn>;
};
