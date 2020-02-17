import * as React from 'react'
import * as $ from 'jquery'
import { each, map } from 'lodash'

import { Accordion, Card, Form } from 'react-bootstrap'

export interface OptionProps {
  eventKey: string;
  type: "switch" | "checkbox" | "radio";
  header: string;
  value: any;
  options: any[];
  setValue: Function;
}

export const Option: React.FunctionComponent<OptionProps> = ({ eventKey, type, header, value, options, setValue }: OptionProps) => {

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
        <h6 className="card-subtitle small text-muted">{value.toString()}</h6>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body>
          <Form>
            {map(options, (o: any, i) =>
              <Form.Check
                key={i}
                type={type}
                id={`${type}-${i}`}
                label={o.toString()}
                checked={o.toString() === value.toString()}
                onChange={(e: any) => handleOnChange(e)}
              />
            )}
          </Form>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}