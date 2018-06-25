// @flow
import { connect } from 'react-redux';
import React from 'react';
import { Timeline, Badge } from 'antd';
import type { serialMessage } from '../../models/serialMessage';

const mapStateToProps = (state) => {
  const messagesByID = state.serial.messages.byID;
  const messages = Object.keys(messagesByID).map(k => messagesByID[k]);

  return {
    messages
  };
};

type Props = {
  messages: serialMessage[]
};

class TimelineComponent extends React.Component<Props> {
  props: Props;

  static badgeClassName(m: serialMessage) {
    const toBadgeStatus = {
      pending: 'processing',
      aborted: 'default',
      sent: 'success',
      error: 'error',
    };
    return toBadgeStatus[m.status];
  }

  render() {
    return (
      <Timeline pending="Waiting for messages">
        {
          this.props.messages.reverse().map((m) => (
            <Timeline.Item key={m.ID}>
              <Badge
                status={TimelineComponent.badgeClassName(m)}
              >
              &quot;{ m.payload }&quot;
              </Badge>
              { m.errorMessage && <p> { m.errorMessage }</p> }
            </Timeline.Item>
          ))
        }
      </Timeline>
    );
  }
}
export default connect(mapStateToProps, null)(TimelineComponent);
