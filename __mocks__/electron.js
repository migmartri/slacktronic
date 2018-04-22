module.exports = {
  app: jest.fn(() => (
    { getPath: jest.fn(() => '/tmp/mocked_path') }
  ))(),
};
