import { connect } from 'react-redux';
import storeToken from '../../actions/slack';
import SlackConfigComponent from '../../components/SlackConfig';

const mapDispatchToProps = (dispatch) => ({
  onTokenCreate: (token: string) => (
    dispatch(storeToken(token))
  )
});

export default connect(null, mapDispatchToProps)(SlackConfigComponent);
