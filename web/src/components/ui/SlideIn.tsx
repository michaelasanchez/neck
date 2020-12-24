import * as React from 'react';
import { useState } from 'react';

import { Loading } from '../Loading';

export interface ISlideInProps {
  className?: string;
  title?: JSX.Element;
  badge?: JSX.Element; // TODO: expecting ButtonGroup
  header?: JSX.Element;
  loading: boolean;
}

const slideInWidth = 340;

const slideInBaseStyle = {
  maxWidth: slideInWidth,
  transition: '500ms transform',
};

export const SlideIn: React.FC<ISlideInProps> = (props) => {
  const { children, className, title, badge, header, loading } = props;

  const slideInStyle = {
    ...slideInBaseStyle,
    transform: 'translateX(0)',
  };

  const slideOutStyle = {
    ...slideInBaseStyle,
    transform: `translateX(-${slideInWidth}px)`,
  };

  const [show, setShow] = useState<boolean>(true); // TODO: constant

  return (
    <div
      className={`slidein ${className}`}
      style={show ? slideInStyle : slideOutStyle}
      // onClick={() => setShow(!show)}
    >
      <div className="badge">{badge}</div>
      <div className="title">{title}</div>
      {header && <div className="header">{header}</div>}
      <div className={`contents${loading ? ' loading' : ''}`}>
        {loading ? (
          <Loading variant="secondary" showLoadingText={false} />
        ) : (
          children
        )}
      </div>
    </div>
  );
};
