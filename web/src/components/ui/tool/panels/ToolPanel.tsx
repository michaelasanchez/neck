import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';

export interface ToolPanelProps {
  className: string;
  collapse?: boolean;
  title: string;
  buttonGroup?: JSX.Element;
  header?: JSX.Element;
  options?: JSX.Element;
}

export const ToolPanel: React.FunctionComponent<ToolPanelProps> = (props) => {
  const { buttonGroup, children, className, header, options, title } = props;

  const [showOptions, setShowOptions] = useState<boolean>(false);

  return (
    <div className={`tool-panel ${className}`}>
      <div className="handles"></div>
      <div className="title">
        <h2>{title}</h2>
        <FontAwesomeIcon
          icon={faCog}
          className={showOptions ? 'active' : ''}
          onClick={() => setShowOptions(!showOptions)}
        />
      </div>
      {buttonGroup && <ButtonGroup size="lg">{buttonGroup}</ButtonGroup>}
      {!!header && <div className="header">{header}</div>}
      <div className="content">
        {!!options && (
          <div className="options">
            <Collapse in={showOptions}>
              <div>
                <div className="options-container">{options}</div>
              </div>
            </Collapse>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
