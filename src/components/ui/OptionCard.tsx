import * as React from 'react';
import { Accordion, Card } from 'react-bootstrap';

export interface OptionProps {
  eventKey: string;
  header: JSX.Element;
  body: JSX.Element;
}

export const OptionCard: React.FunctionComponent<OptionProps> = ({
  eventKey,
  header,
  body,
}: OptionProps) => {
  return (
    <Card>
      <Accordion.Toggle as={Card.Header} variant="link" eventKey={eventKey}>
        {header}
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body>{body}</Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};
