// @flow
import { connect } from 'react-redux';
import HomeComponent from '../../components/HomeComponent';

const mapStateToProps = (state) => ({
  slackConfigured: state.slack.token.valid
});

export default connect(mapStateToProps, null)(HomeComponent);
