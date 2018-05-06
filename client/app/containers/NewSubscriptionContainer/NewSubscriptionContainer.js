// @flow
import * as React from 'react';
import { AVAILABLE_TRIGGERS, AVAILABLE_ACTIONS } from '../../integrations';

type Props = {
};

export default class NewSubscriptionComponent extends React.Component<Props> {
  props: Props;

  render() {
    console.warn(AVAILABLE_TRIGGERS, AVAILABLE_ACTIONS);
    return (
      <div>
        Hello World
      </div>
    );
  }
}
