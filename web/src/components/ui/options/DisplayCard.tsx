import { filter, indexOf, join, map } from 'lodash';
import * as React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { OptionCard, OptionCardProps } from '.';
import { CardKey } from '..';
import { useAppOptionsContext } from '../../..';
import { FretDisplayMode } from '../../neck';

export interface DisplayCardProps extends Pick<OptionCardProps, 'active'> {
  eventKey: CardKey;
}

const getFretDisplayModeLabel = (mode: FretDisplayMode) => {
  switch (mode) {
    case FretDisplayMode.Degree:
      return 'Degree';
    case FretDisplayMode.Marker:
      return 'Marker';
    case FretDisplayMode.Note:
      return 'Note';
    default:
      return 'None';
  }
};

export const DisplayCard: React.FunctionComponent<DisplayCardProps> = (
  props
) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { fretDisplayMode, indicatorsDisplayMode } = appOptions;
  const { active, eventKey } = props;

  const displayModeOptions = filter(FretDisplayMode, (m) => !isNaN(m));

  return (
    <OptionCard
      active={active}
      eventKey={eventKey}
      title="Display"
      subtitle={'well now'}
      body={
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Fret Display Mode</Form.Label>
              <Form.Control
                as="select"
                value={fretDisplayMode}
                onChange={(e) =>
                  setAppOptions({ fretDisplayMode: parseInt(e.target.value) })
                }
              >
                {map(displayModeOptions, (m: FretDisplayMode, i: number) => {
                  return (
                    <option key={i} value={m}>
                      {getFretDisplayModeLabel(m)}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Indicators Display Mode</Form.Label>
              <Form.Control
                as="select"
                value={indicatorsDisplayMode}
                onChange={(e) =>
                  setAppOptions({
                    indicatorsDisplayMode: parseInt(e.target.value),
                  })
                }
              >
                {map(displayModeOptions, (m: FretDisplayMode, i: number) => {
                  return (
                    <option key={i} value={m}>
                      {getFretDisplayModeLabel(m)}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      }
    />
  );
};
