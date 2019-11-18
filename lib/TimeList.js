"use strict";

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactLifecyclesCompat = _interopRequireDefault(require("react-lifecycles-compat"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _List = _interopRequireDefault(require("./List"));

var _dates = _interopRequireDefault(require("./util/dates"));

var _reduceToListState = _interopRequireDefault(require("./util/reduceToListState"));

var CustomPropTypes = _interopRequireWildcard(require("./util/PropTypes"));

var _class,
    _class2,
    _temp2,
    _jsxFileName = "src/TimeList.js";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

var accessors = {
  text: function text(item) {
    return item.label;
  },
  value: function value(item) {
    return item.date;
  }
};

var find = function find(arr, fn) {
  for (var i = 0; i < arr.length; i++) {
    if (fn(arr[i])) return arr[i];
  }

  return null;
};

function getBounds(_ref) {
  var min = _ref.min,
      max = _ref.max,
      timeZone = _ref.timeZone,
      value = _ref.value;
  var date = value || new Date(new Date().setHours(0, 0, 0, 0));

  var start = _momentTimezone.default.utc(date).tz(timeZone).startOf('day').toDate();

  var end = (0, _momentTimezone.default)(start).add(1, 'days').toDate(); // date parts are equal

  return {
    min: min && _dates.default.eq(date, min, 'day') ? min : start,
    max: max && _dates.default.eq(date, max, 'day') ? max : end
  };
}

function getDates(_ref2) {
  var step = _ref2.step,
      props = _objectWithoutProperties(_ref2, ["step"]);

  var times = [];

  var _getBounds = getBounds(props),
      min = _getBounds.min,
      max = _getBounds.max;

  while (_dates.default.lt(min, max)) {
    times.push({
      date: _momentTimezone.default.utc(min).toDate(),
      label: _momentTimezone.default.utc(min).tz(props.timeZone).format('LT')
    });
    min = _momentTimezone.default.utc(min).add(step || 30, 'minutes').toDate();
  }

  return times;
}

var TimeList = (0, _reactLifecyclesCompat.default)(_class = (_temp2 = _class2 =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(TimeList, _React$Component);

  function TimeList() {
    var _temp, _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_temp = _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this, _this.state = {}, _this.handleKeyDown = function (e) {
      var key = e.key;
      var _this$state = _this.state,
          focusedItem = _this$state.focusedItem,
          list = _this$state.list;

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
    }, _temp) || _assertThisInitialized(_this);
  }

  TimeList.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
    var value = nextProps.value,
        currentDate = nextProps.currentDate,
        step = nextProps.step;
    var data = getDates(nextProps);
    var currentValue = value || currentDate;
    var list = (0, _reduceToListState.default)(data, prevState.list, {
      nextProps: nextProps
    });
    var selectedItem = find(data, function (t) {
      return _dates.default.eq(t.date, currentValue, 'minutes');
    });
    var closestDate = find(data, function (t) {
      return Math.abs(_dates.default.diff(t.date, currentValue, 'minutes')) < step;
    });
    return {
      data: data,
      list: list,
      selectedItem: list.nextEnabled(selectedItem),
      focusedItem: list.nextEnabled(selectedItem || closestDate || data[0])
    };
  };

  var _proto = TimeList.prototype;

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.unmounted = true;
  };

  _proto.render = function render() {
    var _props = this.props,
        listProps = _props.listProps,
        props = _objectWithoutProperties(_props, ["listProps"]);

    var _state = this.state,
        data = _state.data,
        list = _state.list,
        focusedItem = _state.focusedItem,
        selectedItem = _state.selectedItem;
    delete props.currentDate;
    delete props.min;
    delete props.max;
    delete props.step;
    delete props.format;
    delete props.culture;
    delete props.preserveDate;
    delete props.value;
    return _react.default.createElement(_List.default, _extends({}, props, listProps, {
      data: data,
      dataState: list.dataState,
      isDisabled: list.isDisabled,
      textAccessor: accessors.text,
      valueAccessor: accessors.value,
      selectedItem: selectedItem,
      focusedItem: focusedItem,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 145
      },
      __self: this
    }));
  };

  return TimeList;
}(_react.default.Component), _class2.defaultProps = {
  step: 30,
  currentDate: new Date(),
  min: new Date(1900, 0, 1),
  max: new Date(2099, 11, 31),
  preserveDate: true
}, _class2.propTypes = {
  value: _propTypes.default.instanceOf(Date),
  step: _propTypes.default.number,
  min: _propTypes.default.instanceOf(Date),
  max: _propTypes.default.instanceOf(Date),
  currentDate: _propTypes.default.instanceOf(Date),
  itemComponent: CustomPropTypes.elementType,
  listProps: _propTypes.default.object,
  format: CustomPropTypes.dateFormat,
  onSelect: _propTypes.default.func,
  preserveDate: _propTypes.default.bool,
  culture: _propTypes.default.string
}, _temp2)) || _class;

var _default = TimeList;
exports.default = _default;
module.exports = exports["default"];