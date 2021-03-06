import * as React from 'react';
import { ReactNode } from 'react';
import { Accordion, Card } from 'react-bootstrap';

export interface OptionCardProps {
  active?: boolean;
  eventKey: string;
  title: string;
  subtitle: string;
  body: ReactNode;
}

export const OptionCard: React.FunctionComponent<OptionCardProps> = ({
  active = false,
  eventKey,
  title,
  subtitle,
  body,
}: OptionCardProps) => {
  return (
    <Card className={`${active ? 'expanded' : ''}`}>
      <Accordion.Toggle as={Card.Header} variant="link" eventKey={eventKey}>
        <h5>{title}</h5>
        <h6 className={`card-subtitle small text-muted`}>{subtitle}</h6>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={eventKey}>
        <Card.Body>{body}</Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};
