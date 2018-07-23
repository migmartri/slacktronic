// @flow
import * as React from 'react';
import { shell } from 'electron';

declare var VERSION:string;

type Props = {
  children: React.Node
};

class AppComponent extends React.Component<Props> {
  props: Props;
  static openUrl(event: SyntheticEvent<HTMLLinkElement>) {
    event.preventDefault();
    return shell.openExternal(event.currentTarget.href);
  }

  render() {
    return (
      <div>
        {this.props.children}
        <div style={{ textAlign: 'right' }}>
          <p>
            Version: &nbsp;
            <a onClick={AppComponent.openUrl} href="https://github.com/migmartri/slacktronic/releases">
              {VERSION}
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default AppComponent;
