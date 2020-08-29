import * as React from 'react'
import * as $ from 'jquery'
import { each, map } from 'lodash'

import { Accordion, Card, Form } from 'react-bootstrap'
import { IOption } from '../../models'

export interface OptionProps {
  eventKey: string;
  type: "switch" | "checkbox" | "radio";
  header: string;
  value: IOption;
  options: IOption[];
  setValue: Function;
}

export const OptionCard: React.FunctionComponent<OptionProps> = ({ eventKey, type, header, value, options, setValue }: OptionProps) => {

  // TODO: probably a better way of doing this
  const handleOnChange = (e: any) => {
    const idString = $(e.target).attr('id');
    const id = parseInt(idString.substr(idString.length - 1));
    setValue(options[id]);
  }

  return (
    <Card>
      <Accordion.Toggle as={Card.Header} variant="link" eventKey={eventKey}>
        <h5>{header}</h5>
        <h6 className="card-subtitle small text-muted">{value.Name}</h6>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body>
          <Form>
            {map(options, (o: any, i) =>
              <Form.Check
                key={`${header}-${i}`}
                type={type}
                id={`${header}-${type}-${i}`}
                label={o.Name}
                checked={o.Name === value.Name} // TODO: Could probably improve this
                onChange={(e: any) => handleOnChange(e)}
              />
            )}
          </Form>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}