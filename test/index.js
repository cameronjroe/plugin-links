import {expect} from 'chai';
import PluginLinks from '../lib';
import fs from 'fs';

describe("Metalsmith Plugins", () => {
  
  var data, p;

  before(() => {
    p = new PluginLinks({
      prefix: 'metalsmith',
      pages: 5
    });
  });

  beforeEach(() => {
    data = {
      items: [
      {
        name: 'metalsmith-templates',
        url: 'https://github.com/segmentio/metalsmith-templates',
        html_url: 'https://github.com/segmentio/metalsmith-templates'
      },
      {
        name: 'metalsmith-layouts',
        url: 'https://github.com/segmentio/metalsmith-layouts',
        html_url: 'https://github.com/segmentio/metalsmith-layouts'
      }
      ]
    };
  });

  it("should get plugin prefix", () => {
    var url = 'https://github.com/segmentio/metalsmith-templates';
    var not_url = 'https://github.com/generator-metalsmith';
    expect(p._hasPluginPrefix(url)).to.be.true;
    expect(p._hasPluginPrefix(not_url)).to.be.false;
  });

  it("should return a list of repo links as an array", (done) => {
    p._getPluginRepoList(data, (output) => {
      expect(output[0]).to.be.a('string');
      expect(output[0]).to.equal('- [metalsmith-templates](https://github.com/segmentio/metalsmith-templates)');
      done();
    });
  });

  it("should write plugin markdown file", (done) => {
    p._getPluginRepoList(data, (output) => {
      p._writePluginMarkdown(output, (markdown) => {
        expect(markdown).to.equal(
          '- [metalsmith-templates](https://github.com/segmentio/metalsmith-templates)\n' +
          '- [metalsmith-layouts](https://github.com/segmentio/metalsmith-layouts)'
        )
        done();
      });
    });
  });

  it("should create plugin list in markdown", (done) => {
    p.create().then((res) => {
      expect(
        res.indexOf(
          '- [metalsmith-templates](https://github.com/segmentio/metalsmith-templates)\n' + 
          '- [metalsmith-collections](https://github.com/segmentio/metalsmith-collections)'
        )
      ).to.not.equal(-1);
      done();
    });
  });

});