import { map } from 'lodash';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Dropdown as BSDropdown } from 'react-bootstrap';

export interface DropdownProps {
  id: string;
  currentIndex: number;
  options: DropdownOption<any>[];
  disabled?: boolean;
  onChange?: (value: any) => void;
}

export interface DropdownOption<T> {
  label: React.ReactElement;
  value: T;
}

export const Dropdown: React.FunctionComponent<DropdownProps> = (props) => {
  const { currentIndex, id, options, disabled = false, onChange } = props;

  const [toggle, setToggle] = useState<boolean>();

  useEffect(() => {
    setToggle(false);
  }, []);

  return (
    <>
      <BSDropdown
        id={`${id}`}
        className={`${disabled ? 'disabled ' : ''}`}
        // ref={menuRef}
        onToggle={(e) => setToggle(e)}
      >
        <BSDropdown.Toggle
          disabled={disabled}
          variant={disabled ? 'light' : 'outline-secondary'}

        >
          {options[currentIndex]?.label || ''}
        </BSDropdown.Toggle>
        <BSDropdown.Menu>
          {map(options, o => (
            <BSDropdown.Item>
              {o.label}
            </BSDropdown.Item>
          ))}
        </BSDropdown.Menu>
      </BSDropdown>
    </>
  );
};
