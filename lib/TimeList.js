"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactComponentManagers = require("react-component-managers");

var _List = _interopRequireDefault(require("./List"));

var _dates = _interopRequireDefault(require("./util/dates"));

var _listDataManager = _interopRequireDefault(require("./util/listDataManager"));

var _localizers = require("./util/localizers");

var CustomPropTypes = _interopRequireWildcard(require("./util/PropTypes"));

var Props = _interopRequireWildcard(require("./util/Props"));

var _jsxFileName = "src/TimeList.js";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var format = function format(props) {
  return _localizers.date.getFormat('time', props.format);
};

var find = function find(arr, fn) {
  for (var i = 0; i < arr.length; i++) {
    if (fn(arr[i])) return arr[i];
  }

  return null;
};

var TimeList =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(TimeList, _React$Component);

  function TimeList() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;

    _this.handleKeyDown = function (e) {
      var key = e.key;
      var focusedItem = _this.state.focusedItem;
      var list = _this.list;

      if (key === 'End') {
        e.preventDefault();

        _this.setState({
          focusedItem: list.last()
        });
      } else if (key === 'Home') {
        e.preventDefault();

        _this.setState({
          focusedItem: list.first()
        });
      } else if (key === 'Enter') {
        _this.props.onSelect(focusedItem);
      } else if (key === 'ArrowDown') {
        e.preventDefault();

        _this.setState({
          focusedItem: list.next(focusedItem)
        });
      } else if (key === 'ArrowUp') {
        e.preventDefault();

        _this.setState({
          focusedItem: list.prev(focusedItem)
        });
      }
    };

    _this.scrollTo = function () {
      if (_this.listRef.move) _this.listRef.move();
    };

    _this.attachListRef = function (ref) {
      return _this.listRef = ref;
    };

    _this.accessors = {
      text: function text(item) {
        return item.label;
      },
      value: function value(item) {
        return item.date;
      }
    };
    _this.timeouts = (0, _reactComponentManagers.timeoutManager)(_assertThisInitialized(_this));
    _this.list = (0, _listDataManager.default)(_assertThisInitialized(_this), {
      getListDataState: _List.default.getListDataState,
      accessors: _this.accessors
    });
    _this.state = _this.getStateFromProps(_this.props);
    return _this;
  }

  var _proto = TimeList.prototype;

  _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.unmounted = true;
  };

  _proto.getBounds = function getBounds(props) {
    var min = props.min,
        max = props.max,
        currentDate = props.currentDate,
        value = props.value;
    value = _dates.default.merge(value, value, currentDate);

    var start = _dates.default.startOf(value, 'day');

    var end = _dates.default.add(start, 1, 'day'); //date parts are equal


    return {
      min: _dates.default.eq(value, min, 'day') ? _dates.default.merge(start, min, currentDate) : start,
      max: _dates.default.eq(value, max, 'day') ? _dates.default.merge(start, max, currentDate) : end
    };
  };

  _proto.getDates = function getDates(props) {
    if (props === void 0) {
      props = this.props;
    }

    var times = [];
    var values = this.getBounds(props);
    var start = values.min;

    var startDay = _dates.default.date(start);

    while (_dates.default.date(start) === startDay && _dates.default.lte(start, values.max)) {
      times.push({
        date: start,
        label: _localizers.date.format(start, format(props), props.culture)
      });
      start = _dates.default.add(start, props.step || 30, 'minutes');
    }

    return times;
  };

  _proto.getStateFromProps = function getStateFromProps(props) {
    if (props === void 0) {
      props = this.props;
    }

    var _props = props,
        value = _props.value,
        currentDate = _props.currentDate,
        step = _props.step;
    var data = this.getDates(props);
    var currentValue = value || currentDate;
    var selectedItem = find(data, function (t) {
      return _dates.default.eq(t.date, currentValue, 'minutes');
    });
    var closestDate = find(data, function (t) {
      return Math.abs(_dates.default.diff(t.date, currentValue, 'minutes')) < step;
    });
    this.list.setData(data);
    return {
      dates: data,
      selectedItem: this.list.nextEnabled(selectedItem),
      focusedItem: this.list.nextEnabled(selectedItem || closestDate || data[0])
    };
  };

  _proto.render = function render() {
    var onSelect = this.props.onSelect;
    var _state = this.state,
        selectedItem = _state.selectedItem,
        focusedItem = _state.focusedItem;
    var props = Props.omitOwn(this);
    var listProps = this.list.defaultProps();
    return _react.default.createElement(_List.default, _extends({}, props, listProps, {
      onSelect: onSelect,
      textAccessor: this.accessors.text,
      valueAccessor: this.accessors.value,
      selectedItem: selectedItem,
      focusedItem: focusedItem,
      ref: this.attachListRef,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 185
      },
      __self: this
    }));
  };

  return TimeList;
}(_react.default.Component);

TimeList.defaultProps = {
  step: 30,
  onSelect: function onSelect() {},
  currentDate: new Date(),
  min: new Date(1900, 0, 1),
  max: new Date(2099, 11, 31),
  preserveDate: true,
  delay: 300
};
TimeList.propTypes = {
  value: _propTypes.default.instanceOf(Date),
  step: _propTypes.default.number,
  min: _propTypes.default.instanceOf(Date),
  max: _propTypes.default.instanceOf(Date),
  currentDate: _propTypes.default.instanceOf(Date),
  itemComponent: CustomPropTypes.elementType,
  format: CustomPropTypes.dateFormat,
  onSelect: _propTypes.default.func,
  preserveDate: _propTypes.default.bool,
  culture: _propTypes.default.string,
  delay: _propTypes.default.number
};
var _default = TimeList;
exports.default = _default;
module.exports = exports["default"];