jest.mock('https', () => ({
  Agent: require('./utils').Agent,
  get: require('./utils').get,
}));

const { requireBadJSON } = require('./data');
const { requestMulti, processResponse } = require('../lib');
const ftsefsi = require('./data/ftse-fsi.json');
const gbphkd = require('./data/gbp-hkd.json');
const gbpusd = require('./data/gbp-usd.json');
const bad_ftsefsi = requireBadJSON();

describe('requestMulti Suite', () => {
  const data = { ftsefsi, gbphkd, gbpusd, bad_ftsefsi };
  const urls = [
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/ftse-fsi.json',
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-hkd.json',
    'https://ft-tech-test-example.s3-eu-west-1.amazonaws.com/gbp-usd.json',
  ];

  describe('requestMulti', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return responses', async () => {
      let results;
      try {
        results = await requestMulti(urls, {
          parse: true,
          timeout: 1000,
          atomic: false,
        });

        expect(results.length).toBe(3);
      } catch (err) {
        expect(err).toBeNull();
      }
    });
  });

  describe('processResponse', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should call correct resolve promise handler', () => {
      const mockedResolved = jest.fn();
      const mockedReject = jest.fn();
      processResponse.apply({ headers: {} }, [
        { atomic: true },
        {
          resolve: mockedResolved,
          reject: mockedReject,
        },
        Buffer.from(JSON.stringify(data.ftsefsi), 'utf8'),
      ]);
      expect(mockedResolved).toHaveBeenCalled();
    });

    it('should call correct reject promise handler', () => {
      const mockedResolved = jest.fn();
      const mockedReject = jest.fn();
      processResponse.apply({ headers: {} }, [
        { parse: true, atomic: true },
        {
          resolve: mockedResolved,
          reject: mockedReject,
        },
        Buffer.from(data.bad_ftsefsi, 'utf8'),
      ]);
      expect(mockedReject).toHaveBeenCalled();
    });

    it('should call correct resolve promise handler', () => {
      const mockedResolved = jest.fn();
      const mockedReject = jest.fn();
      processResponse.apply({ headers: {} }, [
        { parse: false, atomic: true },
        {
          resolve: mockedResolved,
          reject: mockedReject,
        },
        Buffer.from(JSON.stringify(data.gbphkd), 'utf8'),
      ]);
      expect(mockedResolved).toHaveBeenCalled();
      expect(mockedResolved).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.stringContaining('Hong Kong Dollar FX Cross Rate')
        })
      );
    });
  });

  describe('processResponseError', () => {
    // TODO: TBC
    // it('should call correct promise handlers', () => {});
  });
});
