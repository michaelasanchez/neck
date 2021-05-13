import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';

export interface ToolPanelProps {
  className: string;
  docked: boolean;
  title: string;
  collapse?: boolean;
  buttonGroup?: JSX.Element;
  header?: JSX.Element;
  options?: JSX.Element;
}

export const ToolPanel: React.FunctionComponent<ToolPanelProps> = (props) => {
  const { buttonGroup, children, className, docked, header, options, title } =
    props;

  const [showOptions, setShowOptions] = useState<boolean>(false);

  useEffect(() => {
    if (showOptions) {
      setShowOptions(!showOptions);
    }
  }, [docked]);

  return (
    <div className={`tool-panel ${className}`}>
      {buttonGroup && <ButtonGroup size="lg">{buttonGroup}</ButtonGroup>}
      <div className="panel">
        <div className="handles"></div>
        {!docked && (
          <div className="title">
            <h2>{title}</h2>
            {!!options && (
              <FontAwesomeIcon
                icon={faCog}
                className={showOptions ? 'active' : ''}
                onClick={() => setShowOptions(!showOptions)}
              />
            )}
          </div>
        )}
        {!!header && !docked && <div className="header">{header}</div>}
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
    </div>
  );
};
