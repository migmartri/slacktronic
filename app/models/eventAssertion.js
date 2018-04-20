// @flow
// List of current supported assertions
type supportedAssertionsType = 'directMessage' | 'mention';
// Class that will perform the check if a provided slackEvents affects it or not.
class EventAssertion {
  name: supportedAssertionsType
  // TODO(miguel) Add conditions
  constructor(name: supportedAssertionsType) {
    this.name = name;
  }

  assert = (event: { type: string }): boolean => {
    console.log(event);
    return true;
  }
}

export default EventAssertion;
