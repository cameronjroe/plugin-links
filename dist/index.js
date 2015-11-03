'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PluginLinks = (function () {
  function PluginLinks(options) {
    _classCallCheck(this, PluginLinks);

    if (!options.prefix || typeof options.prefix !== 'string') {
      throw new Error('Must pass in plugin prefix name as string. Ex. {prefix: \'metalsmith\'}');
    }
    this.prefix = options.prefix;
    this.heading = options.heading || 'PLUGINS';
    this.fileName = options.fileName || 'PLUGINS';
    this.pages = options.pages || 1;
  }

  _createClass(PluginLinks, [{
    key: '_hasPluginPrefix',
    value: function _hasPluginPrefix(url) {
      return url.indexOf('/' + this.prefix + '-') !== -1;
    }
  }, {
    key: '_getPluginRepoList',
    value: function _getPluginRepoList(data, cb) {
      var _this = this;

      var plugins = _lodash2.default.reduce(data.items, function (acc, item, i) {
        if (_this._hasPluginPrefix(item.url)) {
          var markdownLink = '- [' + item.name + '](' + item.html_url + ')';
          acc.push(markdownLink);
          return acc;
        } else {
          return acc;
        }
      }, []);
      cb(plugins);
    }
  }, {
    key: '_writePluginMarkdown',
    value: function _writePluginMarkdown(plugins, cb) {
      var flat = _lodash2.default.flatten(plugins);
      var ps = _lodash2.default.forEach(flat, function (plugin) {
        return plugin;
      });
      var string = ps.join('\n');
      _fs2.default.writeFile(this.fileName + '.md', string, 'utf8', function (err) {
        if (err) throw new Error(err);
        cb(string);
      });
    }
  }, {
    key: 'create',
    value: function create() {
      var _this2 = this;

      var dfd = _q2.default.defer();
      var promises = _lodash2.default.times(this.pages, function (page) {
        var url = 'https://api.github.com/search/repositories?q=' + _this2.prefix + '-&per_page=' + 100 + '&page=' + page;
        return _axios2.default.get(url).then(function (res) {
          var d = _q2.default.defer();
          _this2._getPluginRepoList(res.data, function (list) {
            d.resolve(list);
          });
          return d.promise;
        });
      });
      _q2.default.allSettled(promises).then(function (results) {
        var plugins = _lodash2.default.map(results, function (result) {
          return result.value;
        });
        _this2._writePluginMarkdown(plugins, function (string) {
          dfd.resolve(string);
        });
      });
      return dfd.promise;
    }
  }]);

  return PluginLinks;
})();

;

exports.default = PluginLinks;