import { expect } from 'chai';
import { gitCz as gitCzParser, nholuongut as nholuongutParser } from '../../src/cli/parsers';

describe('parsers', () => {
  describe('git-cz', () => {
    it('should parse --message "Hello, World!"', () => {
      expect(gitCzParser.parse(['--amend', '--message', 'Hello, World!'])).to.deep.equal(['--amend']);
    });

    it('should parse --message="Hello, World!"', () => {
      expect(gitCzParser.parse(['--amend', '--message=Hello, World!'])).to.deep.equal(['--amend']);
    });

    it('should parse -amwip', () => {
      expect(gitCzParser.parse(['-amwip'])).to.deep.equal(['-a']);
    });

    it('should parse -am=wip', () => {
      expect(gitCzParser.parse(['-am=wip'])).to.deep.equal(['-a']);
    });

    it('should parse -am wip', () => {
      expect(gitCzParser.parse(['-am', 'wip'])).to.deep.equal(['-a']);
    });

    it('should parse -a -m wip -n', () => {
      expect(gitCzParser.parse(['-a', '-m', 'wip', '-n'])).to.deep.equal(['-a', '-n']);
    });

    it('should parse -a -m=wip -n', () => {
      expect(gitCzParser.parse(['-a', '-m=wip', '-n'])).to.deep.equal(['-a', '-n']);
    });
  });

  describe('nholuongut', () => {
    it('should parse out the --amend option', () => {
      expect(nholuongutParser.parse(['--amend'])).to.deep.equal({ _: [], amend: true })
    });
    it('should parse out the --hook option', () => {
      expect(nholuongutParser.parse(['--hook'])).to.deep.equal({ _: [], hook: true })
    });
  });
});
