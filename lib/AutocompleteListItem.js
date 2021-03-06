"use strict";

exports.__esModule = true;
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _jsxFileName = "src/AutocompleteListItem.js";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Fragment = _react.default.Fragment || 'div';
var propTypes = {
  text: _propTypes.default.string,
  searchTerm: _propTypes.default.string
};

function AutocompleteListItem(_ref) {
  var text = _ref.text,
      searchTerm = _ref.searchTerm;
  if (!text || !searchTerm) return _react.default.createElement(Fragment, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 11
    },
    __self: this
  }, text);
  var idx = text.indexOf(searchTerm);
  if (idx === -1) idx = text.toLowerCase().indexOf(searchTerm);
  if (idx === -1 || searchTerm.length >= text.length) return _react.default.createElement(Fragment, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }, text);
  return _react.default.createElement(Fragment, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 19
    },
    __self: this
  }, text.slice(0, idx), _react.default.createElement("strong", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: this
  }, text.slice(idx, idx + searchTerm.length)), text.slice(idx + searchTerm.length));
}

AutocompleteListItem.propTypes = propTypes;
var _default = AutocompleteListItem;
exports.default = _default;
module.exports = exports["default"];