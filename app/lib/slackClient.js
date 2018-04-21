// @flow
import { RTMClient, WebClient } from '@slack/client';
import type { Dispatch, Action, ThunkAction } from '../actions/common';
import * as slackActions from '../actions/slack';
import type { userInfoType } from '../models/slack';

// TODO(miguel) Remove client info
class SlackClient {
  rtmClient: RTMClient
  webClient: WebClient
  token: string
  userInfo: userInfoType
  valid: boolean = false
  dispatch: Dispatch

  // create a client including its validation state
  static async create(token: string, dispatch?: Dispatch) {
    const client = new SlackClient(token, dispatch);
    client.dispatchIfNeeded(slackActions.slackClientCreating());

    await client.getAuthInfo();

    client.dispatchIfNeeded(slackActions.slackClientCreated(client));

    return client;
  }

  constructor(token: string, dispatch?: Dispatch) {
    this.token = token;
    this.rtmClient = new RTMClient(token);
    this.webClient = new WebClient(token);
    if (dispatch) this.dispatch = dispatch;
  }

  getAuthInfo = async () => {
    try {
      this.dispatchIfNeeded(slackActions.tokenValidating(this.token));
      this.dispatchIfNeeded(slackActions.userInfoFetching());

      const authInfo = await this.webClient.auth.test();
      this.valid = authInfo.ok;

      this.userInfo = {
        team: authInfo.team, teamID: authInfo.team_id, user: authInfo.user, userID: authInfo.user_id
      };

      this.dispatchIfNeeded(slackActions.userInfoFetched(this.userInfo));
      this.dispatchIfNeeded(slackActions.tokenValidationOK(this.token));
    } catch (err) {
      console.error('validation error', err);
      this.valid = false;

      this.dispatchIfNeeded(slackActions.userInfoFetchError());
      this.dispatchIfNeeded(slackActions.tokenValidationKO(this.token));
    }
  }

  dispatchIfNeeded(action: Action | ThunkAction) {
    return this.dispatch ? this.dispatch(action) : console.log(action);
  }

  // TODO(miguel) This will be based on some user settings
  initializeSlackSubscriptions(): void {
    const { rtmClient } = this;
    rtmClient.start();

    rtmClient.on('message', (event) => {
      this.dispatchIfNeeded(slackActions.processSlackEvent(event));
    });

    rtmClient.on('im_marked', (event) => {
      this.dispatchIfNeeded(slackActions.processSlackEvent(event));
    });

    // We subscribe to the current User
    rtmClient.subscribePresence([this.userInfo.userID]);

    rtmClient.on('presence_change', (event) => {
      this.dispatchIfNeeded(slackActions.processSlackEvent(event));
    });
  }
}

export default SlackClient;

