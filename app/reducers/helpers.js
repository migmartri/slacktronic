// @flow


type resourcesByID = { byID: { [string]: Object }, allIDs: string[] };

const MAX_ENTRIES = 10;
// Returns the MAX_ENTRIES limiting the number of events
// that we store in the redux store
const rotatedEntries = (stateEntries: resourcesByID) => {
  const entriesIDs = [...stateEntries.allIDs];
  const entriesByID = { ...stateEntries.byID };

  if (entriesIDs.length >= MAX_ENTRIES) {
    const toRemove = entriesIDs.shift();
    delete entriesByID[toRemove];
  }
  return { byID: entriesByID, allIDs: entriesIDs };
};

export default rotatedEntries;
