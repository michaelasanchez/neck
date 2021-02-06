import * as React from 'react';
import { useState } from 'react';

import { Loading } from '../../Loading';

export interface ISlideInProps {
  className?: string;
  title?: JSX.Element;
  badge?: JSX.Element;
  header?: JSX.Element;
  loading: boolean;
  show?: boolean;
  devYOffset?: number;
}

const slideInWidth = 400;

const slideInBaseStyle = {
  maxWidth: slideInWidth,
  transition: '500ms transform',
};

export const SlideIn: React.FC<ISlideInProps> = (props) => {
  const {
    children,
    className,
    title,
    badge,
    header,
    loading,
    show = false,
  } = props;

  const slideInStyle = {
    ...slideInBaseStyle,
    transform: `translateX(0)`,
    top: props.devYOffset || 100,
  };

  const slideOutStyle = {
    ...slideInBaseStyle,
    transform: `translateX(-${slideInWidth}px)`,
    top: props.devYOffset || 100,
  };

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
