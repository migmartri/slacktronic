// @flow
import * as React from 'react';

type Props = {
  children: React.Node
};

class AppComponent extends React.Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default AppComponent;
