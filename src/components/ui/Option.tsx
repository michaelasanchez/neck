import * as React from 'react'

import { Accordion, Card, Button } from 'react-bootstrap';

export interface OptionProps {
  eventKey: string;
  header: string;
  body: string;
}

export const Option: React.FunctionComponent<OptionProps> = ({ eventKey, header, body }) => {
  return (
    <Card>
      <Card.Header>
        <Accordion.Toggle as={Button} variant="link" eventKey={eventKey}>
          <h5>{header}</h5>
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body>{body}</Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}