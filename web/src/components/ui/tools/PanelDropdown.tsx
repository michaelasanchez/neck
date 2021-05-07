import { map } from 'lodash';
import * as React from 'react';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

export interface PanelDropdownItem {
  label: string;
  value: any;
}

interface PanelDropdownProps {
  active?: PanelDropdownItem;
  options: PanelDropdownItem[];
  optionsEqual?: (
    firstOption: PanelDropdownItem,
    secondOption: PanelDropdownItem
  ) => boolean;
}

const defaultOptionsEqual = (
  firstOption: PanelDropdownItem,
  secondOption: PanelDropdownItem
) => firstOption.value == secondOption.value;

export const PanelDropdown: React.FunctionComponent<PanelDropdownProps> = (
  props
) => {
  const { active, options, optionsEqual } = props;

  const equal = optionsEqual || defaultOptionsEqual;

  return (
    <DropdownButton
      variant="secondary"
      as={ButtonGroup}
      title={'hey'}
      // id="dropdown-note"
    >
      {map(options, (v, i) => (
        <Dropdown.Item
          eventKey={v.label}
          key={i}
          active={!!active && equal(v, active.value)}
        >
          {v.label}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};
