import { map } from 'lodash';
import * as React from 'react';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

export interface PanelDropdownItem {
  label: string;
  value: any;
}

interface PanelDropdownProps {
  active: PanelDropdownItem;
  options: PanelDropdownItem[];
  optionsEqual?: (firstOption: any, secondOption: any) => boolean;
  onSelect?: (selected: any) => void;
}

const defaultOptionsEqual = (firstOption: any, secondOption: any) =>
  firstOption == secondOption;

export const PanelDropdown: React.FunctionComponent<PanelDropdownProps> = (
  props
) => {
  const { active, options, optionsEqual, onSelect } = props;

  const equal = optionsEqual || defaultOptionsEqual;

  return (
    <DropdownButton variant="secondary" as={ButtonGroup} title={active.label}>
      {map(options, (o, i) => (
        <Dropdown.Item
          eventKey={o.label}
          key={i}
          active={!!active && equal(o.value, active.value)}
          onSelect={() => onSelect(o.value)}
        >
          {o.label}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};
