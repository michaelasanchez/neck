import { findIndex, indexOf, map } from 'lodash';
import * as React from 'react';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { ISlideInProps, SlideIn } from '.';

interface DropdownSlideInProps extends ISlideInProps {
  options: IDropdownOption<any>[];
}

export interface IDropdownOption<T> {
  active: T;
  disabled?: T[];
  values: Array<T>;
  getLabel: (value: T) => string;
  getButtonLabel?: (value: T) => string;
  onUpdate: (value: T) => void;
  valuesEqual?: (value1: T, value2: T) => boolean;
}

const defaultValuesEqual = (a: any, b: any): boolean => a === b;

export const DropdownSlideIn: React.FC<DropdownSlideInProps> = (props) => {
  const { options } = props;

  const badge = (
    <ButtonGroup size="lg">
      {map(options, (o, i) => {
        const getButtonTitle = o.getButtonLabel || o.getLabel;
        const equal = o.valuesEqual || defaultValuesEqual;

        return (
          <DropdownButton
            variant="secondary"
            as={ButtonGroup}
            key={i}
            title={getButtonTitle(o.active)}
            id="dropdown-note"
          >
            {map(o.values, (n, i) => {
              const active = findIndex(o.values, (v) => equal(v, o.active));

              return (
                <Dropdown.Item
                  eventKey={i.toString()}
                  key={i}
                  active={i == active}
                  disabled={o.disabled && indexOf(o.disabled, n) >= 0}
                  onSelect={() => o.onUpdate(n)}
                >
                  {o.getLabel(n)}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
        );
      })}
    </ButtonGroup>
  );

  return <SlideIn {...props} badge={badge} />;
};
