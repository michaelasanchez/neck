import * as React from 'react';

interface ToolPanelProps {
  className: string;
  title: string;
}

export const ToolPanel: React.FunctionComponent<ToolPanelProps> = (props) => {
  const { children, className, title } = props;

  return (
    <div className={`tool-panel ${className}`}>
      {/* <div className="panel"> */}
        <h2>{title}</h2>
        <div className="header"></div>
        <div className="content">{children}</div>
      </div>
    // </div>
  );
};
