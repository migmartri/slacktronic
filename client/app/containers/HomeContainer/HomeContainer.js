// @flow
import { connect } from 'react-redux';
import HomeComponent from '../../components/HomeComponent';
import type { Dispatch } from '../../actions/common';
import actionTypes from '../../actions/actionTypes';

const mapStateToProps = (state) => {
  const providersByName = state.providers.byName;
  const { slack: slackProvider } = providersByName;
  return {
    slackConfigured: !!slackProvider && slackProvider.status === 'ready',
    appInitializationStatus: state.app.initializationStatus
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onLoad: (skipInit: boolean) => {
    if (skipInit) return;

    dispatch({ type: actionTypes.APP_INITIALIZE });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
