import * as React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Loading } from '../Loading';

export interface ISlideInProps {
  className?: string;
  headerTitle?: JSX.Element;
  headerButton?: JSX.Element;
  loading: boolean;
}

const slideInWidth = 340;

const slideInBaseStyle = {
  maxWidth: slideInWidth,
  transition: '500ms transform',
};

export const SlideIn: React.FC<ISlideInProps> = (props) => {
  const { className, headerTitle, headerButton: headerRight, loading } = props;

  const slideInStyle = {
    ...slideInBaseStyle,
    transform: 'translateX(0)',
  };

  const slideOutStyle = {
    ...slideInBaseStyle,
    transform: `translateX(-${slideInWidth}px)`,
  };

  const show = true;

  return (
    <div
      className={`slidein ${className}`}
      style={show ? slideInStyle : slideOutStyle}
    >
      <div className="header">
        <div className="title">{headerTitle}</div>
        <div className="right">{headerRight}</div>
      </div>
      <div className="contents">
        {loading ? <Loading variant="secondary" showLoadingText={false} /> : <>{props.children}</>}
      </div>
    </div>
  );
};
