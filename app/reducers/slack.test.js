// @flow
import slackReducer from './slack';
import actionTypes from '../actions/actionTypes';

describe('slackReducer', () => {
  let state;
  const existingEvent = { ID: 'foo', type: 'my_type', user: 'bar' };

  beforeEach(() => {
    state = {
      token: {
        storing: false,
        validating: false,
        valid: false,
      },
      events: {
        byID: { foo: existingEvent },
        allIDs: ['foo']
      }
    };
  });

  describe('SLACK_EVENT', () => {
    const newEvent = { ID: 'bar', type: 'baz' };

    let action = {
      type: actionTypes.SLACK_EVENT,
      data: newEvent
    };

    it('adds new events to the store', () => {
      const res = slackReducer(state, action);
      expect(res.events.allIDs).toEqual(['foo', 'bar']);
      expect(res.events.byID).toEqual({ foo: existingEvent, bar: newEvent });
    });

    it('has a maximun of 10 events stored and rotates them', () => {
      // We add 9 more events
      for (let i = 0; i < 9; i += 1) {
        action = {
          type: actionTypes.SLACK_EVENT,
          data: { ID: `added-${i + 1}`, type: `baz${i}` }
        };
        state = slackReducer(state, action);
      }

      expect(state.events.allIDs.length).toEqual(10);
      expect(state.events.allIDs[0]).toEqual('foo');
      expect(state.events.allIDs[9]).toEqual('added-9');

      // Add an extra one
      action = {
        type: actionTypes.SLACK_EVENT,
        data: { ID: 'overflown', type: 'overf' }
      };

      state = slackReducer(state, action);
      expect(state.events.allIDs.length).toEqual(10);
      expect(state.events.allIDs[0]).toEqual('added-1');
      expect(state.events.allIDs[9]).toEqual('overflown');
    });
  });
});
