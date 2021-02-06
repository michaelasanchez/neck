import * as React from 'react';
import { SlideIn } from '.';

export interface KeySlideInProps {}

export const KeySlideIn: React.FunctionComponent<KeySlideInProps> = (props) => {
  return <SlideIn loading={false} />;
};
