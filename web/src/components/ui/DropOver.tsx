import { map } from 'lodash';
import * as React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { TuningNote } from '../../models';

export interface DropOverProps {
  id: string;
  currentIndex: number;
  options: Array<DropOverOption<TuningNote>>;
  disabled?: boolean;
}

export interface DropOverOption<T> {
  label: React.ReactElement;
  value: T;
}

export const DropOver: React.FunctionComponent<DropOverProps> = (props) => {
  const { currentIndex, id, options, disabled = false } = props;

  return (
    <DropdownButton
      disabled={disabled}
      className="dropover"
      id={`${id}`}
      variant="light"
      title={options[currentIndex].label}
      onClick={(e: React.BaseSyntheticEvent) => {
        console.log(e);
        e.stopPropagation();
      }}
    >
      {map(options, (o, i) => (
        <Dropdown.Item
          eventKey={i.toString()}
          key={i}
          active={i === currentIndex}
        >
          {o.label}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};
