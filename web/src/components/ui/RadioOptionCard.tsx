import { map } from 'lodash';
import * as React from 'react';
import { Form } from 'react-bootstrap';

import { OptionCard } from '.';
import { IOption } from '../../shared';

export interface RadioOptionCard {
  eventKey: string;
  title: string;
  value: IOption;
  options: IOption[];
  setValue: Function;
}

export const RadioOptionCard: React.FunctionComponent<RadioOptionCard> = (
  props
) => {
  const { eventKey, title, value, options, setValue } = props;

  const header = (
    <>
      <h5>{title}</h5>
      <h6 className="card-subtitle small text-muted">{value.Label}</h6>
    </>
  );

  const body = (
    <Form>
      {map(options, (o: IOption, i: number) => (
        <Form.Check
          id={`${header}-${i}`}
          key={`${header}-${i}`}
          type={'radio'}
          label={o.Label}
          checked={o.Label === value.Label}
          onChange={() => setValue(options[i])}
        />
      ))}
    </Form>
  );

  return <OptionCard header={header} body={body} eventKey={eventKey} />;
};
