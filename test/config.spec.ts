/// <reference path="../src/types/vender.d.ts"/>
import { expect } from 'chai';
import * as path from 'path';
import { loadConfig, config, parse } from '../src/config';

let content: IOptions;
const configFile = path.resolve(__dirname, '../env.yaml');
before(() => {
  content = loadConfig();
});

describe('Testing configuration.', () => {
  it('should parse with right NODE_ENV.', () => {
    expect(process.env.NODE_ENV).to.equals('test');
  });

  it('should return correct config.', () => {
    expect(config('log')).to.eql(content.log);
    expect(config('log.level')).to.eql(content.log.level);
    expect(config('test_array')).to.eql([
      { name: 'a', age: 10 },
      { name: 'b', age: 11 },
      { name: 'c', age: 12 },
    ]);

    expect(config('test_array[0].name')).to.equal('a');
  });

  it('should set correct config.', () => {
    config('test', { a: 1 });
    expect(config('test')).to.eql({ a: 1 });
    expect(config('test.a')).to.eql(1);

    config('test.a', 2);
    expect(config('test')).to.eql({ a: 2 });
    expect(config('test.a')).to.eql(2);
  });

  it ('should restore config after restart.', () => {
    parse(configFile);
    expect(config('test')).to.be.an('undefined');
    expect(config('test.a')).to.be.an('undefined');
  });
});
