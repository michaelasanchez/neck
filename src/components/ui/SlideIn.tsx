import * as React from 'react';

export interface ISlideInProps {
  title?: string;
}

export const SlideIn: React.FC<ISlideInProps> = (props) => {
  const { title } = props;

  return (
    <div className="slidein">
      <h3>{title}</h3>
      {props.children}
    </div>
  );
};
