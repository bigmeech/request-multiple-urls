module.exports = {
  Agent: jest.fn(),
  get: jest.fn().mockImplementation((a, b, c) => {
    c({
      on: jest.fn().mockImplementation((evtName, cb) => {
        cb(JSON.stringify({ message: 'hello world' }));
      }),
    });
  }),
};
