// @flow
import actionTypes from '../actions/actionTypes';
import * as slackModels from '../models/slack';
import rotatedEntries from './helpers';

export type slackReduxStateType = {
  +events: {
    byID: { [string]: slackModels.eventType },
    allIDs: string[]
  }
};

const initialState: slackReduxStateType = {
  events: { byID: {}, allIDs: [] }
};

export default function slack(state: slackReduxStateType = initialState, action: any) {
  switch (action.type) {
    // Reduce the events
    case actionTypes.SLACK_EVENT:
      return {
        ...state,
        events: {
          ...state.events,
          byID: {
            ...rotatedEntries(state.events).byID, [action.data.ID]: action.data
          },
          allIDs: [...rotatedEntries(state.events).allIDs, action.data.ID]
        }
      };
    default:
      return state;
  }
}
