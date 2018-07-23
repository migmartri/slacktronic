// @flow
import * as React from 'react';
import { Spin, Row, Col } from 'antd';
import styles from './LoadingWrapper.scss';

type Props = {
  loaded: boolean,
  children: React.Node
};

export default class LoadingPageComponent extends React.Component<Props> {
  props: Props;
  static defaultProps = {
    loaded: false
  }

  render() {
    return (
      <React.Fragment>
        { !this.props.loaded &&
          <Row type="flex" align="middle" justify="center" className={styles.loadingPage}>
            <Col>
              <Spin size="large" />
            </Col>
          </Row>
        }

        { this.props.loaded && this.props.children }
      </React.Fragment>
    );
  }
}
