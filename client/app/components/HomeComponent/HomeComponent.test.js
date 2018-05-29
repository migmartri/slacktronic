// @flow
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import HomeComponent from './';

Enzyme.configure({ adapter: new Adapter() });

describe('Home component', () => {
  const onLoadFn = jest.fn();
  const testProps = {
    onLoad: onLoadFn,
    slackConfigured: false,
    location: {}
  };

  it('shows the slackConfig info by default', () => {
    const wrapper = shallow(<HomeComponent {...testProps} />);
    expect(wrapper.find('.configure-slack')).toExist();
  });

  it('does not shows the slackConfig info if configured', () => {
    const wrapper = shallow(<HomeComponent {...testProps} slackConfigured />);
    expect(wrapper.find('.configure-slack')).not.toExist();
  });
});
