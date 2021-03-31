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
  collapse?: boolean;
  devYOffset?: number;
}

// export const slideInDuration = 10000;
export const slideInDuration = 600;

// TODO: might need for resizing
const style = {
  maxWidth: 400,
};

export const SlideIn: React.FC<ISlideInProps> = (props) => {
  const {
    children,
    className,
    title,
    badge,
    header,
    loading,
    collapse = false,
  } = props;

  const slideInRef = useRef();

  const [animationFlag, setAnimationFlag] = useState<boolean>(false);
  const [transitionFlag, setTransitionFlag] = useState<boolean>(false);

  useEffect(() => {
    const current = slideInRef.current;

    if (animationFlag) {
      if (!transitionFlag) setTransitionFlag(true);

      if (collapse) {
        $(current).addClass('out');
        $('.contents', current)
          .css({ maxHeight: 600 })
          .animate({ maxHeight: 0 }, slideInDuration * 0.4);
      } else {
        $(current).addClass('in');
        $('.contents', current)
          .delay(slideInDuration * 0.5)
          .css({ maxHeight: 0 })
          .animate({ maxHeight: 600 }, slideInDuration * 0.8);
      }
    } else {
      setAnimationFlag(true);
    }
  }, [collapse]);

  return (
    <div
      className={`slidein ${className}${collapse ? ' collapsed' : ''}`}
      style={style}
      ref={slideInRef}
    >
      <div className="badge">{badge}</div>
      <div className="title">{title}</div>
      {header && <div className="header">{header}</div>}
      <div
        className={`contents${loading ? ' loading' : ''}`}
        style={
          !transitionFlag && !collapse
            ? { transition: `all ${slideInDuration * 0.5}ms ease-in-out` }
            : null
        }
      >
        {loading ? (
          <Loading variant="secondary" showLoadingText={false} />
        ) : (
          children
        )}
      </div>
    </div>
  );
};
