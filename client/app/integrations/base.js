// @flow

export type valuesEntries = {
  label: string,
  value: string
}[];

export type valuesFuncType = (...args?: any) => valuesEntries;

type controlType = 'select' | 'input' | 'hidden';

export type triggerOptionsTypes = {
  ID: string, required: boolean, values: valuesFuncType, controlType: controlType
}[];

type metadataType = {
  name: string,
  description?: string
};

export type optionsValuesType = { [string]: { value: any, label?: string }};

class TriggerOrAction {
  // Assigning typed static options does not work.
  static options = [];
  static metadata: metadataType;

  // Validates that the required options are present
  constructor(triggerActionOptions: triggerOptionsTypes, optionsValues: optionsValuesType) {
    triggerActionOptions.filter(opt => opt.required).forEach(opt => {
      const { value } = optionsValues[opt.ID];
      if (!value || value === '') throw new Error(`${opt.ID} is required`);
    });
  }
}

export default TriggerOrAction;
