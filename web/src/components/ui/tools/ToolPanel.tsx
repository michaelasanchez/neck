import * as React from 'react';

interface ToolPanelProps {
  className: string;
  title: string;
}

export const ToolPanel: React.FunctionComponent<ToolPanelProps> = (props) => {
  const { className, title } = props;

  return (
    <div className={`tool-panel ${className}`}>
      {/* <div className="panel"> */}
        <h2>{title}</h2>
        <div className="header"></div>
        <div className="content">do do do do do do do do do dod od od od od od od od odo od od odo do do do do do do do do do do do do do do do dod od d odo do dod od odo do do do do dod od od od odo do do do do do do do do do do do do do do do do do do d od od od do dod od do do do do do do do do do do do do do do do do d odo do dod od od od od od odo d od od od od od od od od od od od od od od odo do d od od odo do d od od od odo do do do do do do do do do do</div>
      </div>
    // </div>
  );
};
