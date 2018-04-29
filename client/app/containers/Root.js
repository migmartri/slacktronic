// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { LocaleProvider, Row, Col } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import Routes from '../routes';


type Props = {
  store: {},
  history: {}
};

export default class Root extends Component<Props> {
  render() {
    return (
      <LocaleProvider locale={enUS}>
        <Row>
          <Col span={22} offset={1} className="container">
            <Provider store={this.props.store}>
              <ConnectedRouter history={this.props.history}>
                <Routes />
              </ConnectedRouter>
            </Provider>
          </Col>
        </Row>
      </LocaleProvider>
    );
  }
}
