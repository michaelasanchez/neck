import * as $ from 'jquery';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { Loading } from '../../Loading';

export interface ISlideInProps {
  className?: string;
  title?: JSX.Element;
  badge?: JSX.Element;
  header?: JSX.Element;
  loading: boolean;
  show?: boolean;
  collapse?: boolean;
  devYOffset?: number;
}

const slideInWidth = 400;

const slideInBaseStyle = {
  maxWidth: slideInWidth,
  // transition: '500ms transform',
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
    collapse = false,
  } = props;

  const slideInRef = useRef();

  useEffect(() => {
    const current = slideInRef.current;
    const test = $(current);
    // if (!collapse) $(current).addClass('show');
    // else $(current).removeClass('show');

    const duration = 500;

    if (collapse) {
      $('.contents', current).animate({maxHeight: 0 }, duration * .4)
    } else {
      $('.contents', current).delay(300).animate({maxHeight: 600 }, duration * .8)
    }

  }, [collapse]);

  const slideInStyle = {
    ...slideInBaseStyle,
    // transform: `translateX(0)`,
    // transform: `translate(0px, 100px)`,
    // top: 100, //props.devYOffset || 100,
    // zIndex: 11
  };

  const slideOutStyle = {
    ...slideInBaseStyle,
    // transform: `translateX(-${slideInWidth}px)`,
    // transform: `translate(-20px, 80px)`,
    // left: -20,
    // top: 80, //props.devYOffset || 100,
    // zIndex: 10
  };

  return (
    <div
      className={`slidein ${className} ${collapse ? ' collapsed' : ''}`}
      style={!collapse ? slideInStyle : slideOutStyle}
      ref={slideInRef}
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
