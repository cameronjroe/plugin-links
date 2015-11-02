import axios from 'axios';
import _ from 'lodash';
import fs from 'fs';
import q from 'q';

class PluginLinks {
  
  constructor(options) {
    if (!options.prefix || typeof options.prefix !== 'string') {
      throw new Error('Must pass in plugin prefix name as string. Ex. {prefix: \'metalsmith\'}');
    }
    this.prefix = options.prefix;
    this.heading = options.heading || 'PLUGINS';
    this.fileName = options.fileName || 'PLUGINS';
    this.pages = options.pages || 1;
  }

  _hasPluginPrefix(url) {
    return url.indexOf(`/${this.prefix}-`) !== -1;
  }
  
  _getPluginRepoList(data, cb) {
    var plugins = _.reduce(data.items, (acc, item, i) => {
      if ( this._hasPluginPrefix(item.url) ) {
        var markdownLink = `- [${item.name}](${item.url})`;
        acc.push(markdownLink);
        return acc;
      } else {
        return acc;
      }
    }, []);
    cb(plugins);
  }

  _writePluginMarkdown(plugins, cb) {
    var flat = _.flatten(plugins);
    var ps = _.forEach(flat, (plugin) => {
      return plugin;
    });
    var string = ps.join('\n');
    fs.writeFile(`${this.fileName}.md`, string, 'utf8', (err) => {
      if (err) throw new Error(err);
      cb(string);
    });
  }

  create() {
    var dfd = q.defer();
    var promises = _.times(this.pages, (page) => {
      var url = `https://api.github.com/search/repositories?q=${this.prefix}-&per_page=${100}&page=${page}`;
      return axios.get(url)
        .then((res) => {
          var d = q.defer();
          this._getPluginRepoList(res.data, (list) => {
            d.resolve(list);
          });
          return d.promise;
        });
    });
    q.allSettled(promises).then((results) => {
      var plugins = _.map(results, (result) => {
        return result.value;
      });
      this._writePluginMarkdown(plugins, (string) => {
        dfd.resolve(string);
      });
    });
    return dfd.promise;
  }
};

export default PluginLinks;