import { map } from 'lodash';
import * as React from 'react';
import { Form } from 'react-bootstrap';
import { OptionCardProps, OptionCard } from './options';

interface IOption {
  Label: string;
}

export interface RadioOptionCard
  extends Pick<OptionCardProps, 'active' | 'title'> {
  eventKey: string;
  value: IOption;
  options: IOption[];
  setValue: Function;
}

export const RadioOptionCard: React.FunctionComponent<RadioOptionCard> = (
  props
) => {
  const { eventKey, value, options, setValue, ...rest } = props;

  const body = (
    <Form>
      {map(options, (o: IOption, i: number) => (
        <Form.Check
          id={`option-${i}`}
          key={i}
          type={'radio'}
          label={o.Label}
          checked={o.Label === value.Label}
          onChange={() => setValue(options[i])}
        />
      ))}
    </Form>
  );

  return (
    <OptionCard
      {...rest}
      subtitle={value.Label}
      body={body}
      eventKey={eventKey}
    />
  );
};
