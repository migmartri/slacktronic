// @flow
import { RTMClient, WebClient } from '@slack/client';
import type { userInfoType } from '../models/slack';

// TODO(miguel) Remove client info
class SlackClient {
  rtmClient: RTMClient
  webClient: WebClient
  token: string
  userInfo: userInfoType

  // create a client including its validation state
  static async validate(token: string) {
    const client = new SlackClient(token);
    try {
      const authInfo = await client.webClient.auth.test();
      return authInfo.ok;
    } catch (err) {
      return false;
    }
  }

  constructor(token: string) {
    this.token = token;
    this.rtmClient = new RTMClient(token);
    this.webClient = new WebClient(token);
  }
}

export default SlackClient;

