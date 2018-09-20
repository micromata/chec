'use strict';

const childProcess = require('child_process');
const readDependencies = require('./read-dependencies');

jest.mock('child_process', () => ({
  spawnSync: jest.fn()
}));

const stringifiedTree = JSON.stringify({
  name: 'A',
  version: '1.0.0',
  dependencies: {
    AA: {
      version: '1.1.0',
      dependencies: {
        AAA: { version: '1.1.1' },
        AAB: { version: '1.1.2' },
        AAC: { version: '1.1.3' }
      }
    },
    AB: {
      version: '1.2.0',
      dependencies: {
        ABA: { version: '1.2.1' },
        ABB: { version: '1.2.2' },
        ABC: { version: '1.2.3' }
      }
    }
  }
});

describe('readDependencies', () => {
  beforeEach(() => {
    childProcess.spawnSync.mockReset();
    childProcess.spawnSync.mockImplementation(() => ({ stdout: stringifiedTree }));
  });

  describe('when called with falsy mode', () => {
    it('calls child_process.spawnSync "npm ls --json"', () => {
      readDependencies();

      expect(childProcess.spawnSync).toHaveBeenCalledWith('npm', [ 'ls', '--json' ]);
    });

    it('returns parsed json returned by child process', () => {
      const expected = {
        tree: JSON.parse(stringifiedTree),
        problems: ''
      };
      const actual = readDependencies();

      expect(actual).toEqual(expected);
    });
  });

  describe('when called with mode="production"', () => {
    it('calls child_process.spawnSync "npm ls --json --production"', () => {
      readDependencies('production');

      expect(childProcess.spawnSync).toHaveBeenCalledWith('npm', [ 'ls', '--json', '--production' ]);
    });

    it('returns parsed json returned by child process', () => {
      const expected = {
        tree: JSON.parse(stringifiedTree),
        problems: ''
      };
      const actual = readDependencies('production');

      expect(actual).toEqual(expected);
    });
  });

  describe('when called with mode="development"', () => {
    it('calls child_process.spawnSync "npm ls --json --development"', () => {
      readDependencies('development');

      expect(childProcess.spawnSync).toHaveBeenCalledWith('npm', [ 'ls', '--json', '--development' ]);
    });

    it('returns parsed json returned by child process', () => {
      const expected = {
        tree: JSON.parse(stringifiedTree),
        problems: ''
      };
      const actual = readDependencies('development');

      expect(actual).toEqual(expected);
    });
  });
});