import { join } from 'lodash';
import * as React from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { OptionCard, OptionCardProps } from '.';
import { CardKey } from '..';
import { useAppOptionsContext } from '../../..';

export interface GeneralCardProps extends Pick<OptionCardProps, 'active'> {
  eventKey: CardKey;
}

const getSubtitle = (
  leftHandMode: boolean,
  leftHandUi: boolean,
  autoScroll: boolean
) => {
  const notDefault = [];
  if (!autoScroll) {
    notDefault.push('Auto-scroll off');
  }
  if (leftHandMode && leftHandUi) {
    notDefault.push('Left-hand Mode');
  } else if (leftHandMode) {
    notDefault.push('Left-hand Guitar');
  } else if (leftHandUi) {
    notDefault.push('Left-hand UI');
  }
  if (!notDefault.length) {
    return 'Default';
  } else {
    return join(notDefault, ', ');
  }
};

export const GeneralCard: React.FunctionComponent<GeneralCardProps> = (
  props
) => {
  const { appOptions, setAppOptions } = useAppOptionsContext();
  const { leftHandMode, leftHandUi, autoScroll } = appOptions;
  const { active, eventKey } = props;

  return (
    <OptionCard
      active={active}
      eventKey={eventKey}
      title="General"
      subtitle={getSubtitle(leftHandMode, leftHandUi, autoScroll)}
      body={
        <Row>
          <Col>
            <Form.Group
              onClick={(e: any) => {
                setAppOptions({ autoScroll: !autoScroll });
              }}
              className="clickable"
            >
              <Form.Check
                type="checkbox"
                label="Auto-scroll"
                custom
                checked={autoScroll}
                onChange={() => {}}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group
              onClick={(e: any) =>
                setAppOptions({
                  leftHandMode: !leftHandMode || !leftHandUi,
                  leftHandUi: !leftHandMode || !leftHandUi,
                })
              }
              className="clickable mb-1"
            >
              <Form.Check
                type="checkbox"
                label={<h6>Left-hand modes</h6>}
                custom
                checked={leftHandMode && leftHandUi}
                onChange={() => {}}
              />
            </Form.Group>
            <Form.Group
              onClick={(e: any) =>
                setAppOptions({
                  leftHandMode: !leftHandMode,
                })
              }
              className="clickable mb-1 ml-3"
            >
              <Form.Check
                type="checkbox"
                label="Guitar"
                custom
                checked={leftHandMode}
                onChange={() => {}}
              />
            </Form.Group>
            <Form.Group
              onClick={(e: any) => {
                setAppOptions({ leftHandUi: !leftHandUi });
              }}
              className="clickable mb-0 ml-3"
            >
              <Form.Check
                type="checkbox"
                label="UI"
                custom
                checked={leftHandUi}
                onChange={() => {}}
              />
            </Form.Group>
          </Col>
        </Row>
      }
    />
  );
};
