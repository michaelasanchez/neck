import { map } from 'lodash';
import * as React from 'react';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { ISlideInProps, SlideIn } from '.';

interface BadgeSlideInProps extends ISlideInProps {
  options: IBadgeOption[];
}

interface IBadgeOption {
  active: number;
  values: Array<any>;
  getLabel: (value: any) => string;
  onUpdate: (value: any) => void;
}

export const BadgeSlideIn: React.FC<BadgeSlideInProps> = (props) => {
  const { options } = props;

  const badge = (
    <ButtonGroup size="lg">
      {map(options, (o, i) => (
        <DropdownButton
          variant="secondary"
          as={ButtonGroup}
          key={i}
          title={o.getLabel(o.values[o.active])}
          id="dropdown-note"
        >
          {map(o.values, (n, i) => (
            <Dropdown.Item
              eventKey={i.toString()}
              key={i}
              active={i == o.active}
              onSelect={() => o.onUpdate(n)}
            >
              {o.getLabel(n)}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      ))}
    </ButtonGroup>
  );

  return <SlideIn {...props} badge={badge} />;
};
