import * as React from 'react';
import { ButtonGroup } from 'react-bootstrap';

export interface ToolPanelProps {
  className: string;
  collapse?: boolean;
  title: string;
  buttonGroup?: JSX.Element;
}

export const ToolPanel: React.FunctionComponent<ToolPanelProps> = (props) => {
  const { children, className, buttonGroup, title } = props;

  return (
    <div className={`tool-panel ${className}`}>
      <div className="handles"></div>
      <h2>{title}</h2>
      {buttonGroup && <ButtonGroup size="lg">{buttonGroup}</ButtonGroup>}
      <div className="header"></div>
      <div className="content">{children}</div>
    </div>
  );
};
