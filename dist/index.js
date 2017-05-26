'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                              * 在页面滚动的时候，监听滚动事件，在快要到达底部指定距离的时候，执行相应函数
                                                                                                                                                                                                                                                                              * 如果传入 totalPages, 则会在鼠标滚动时
                                                                                                                                                                                                                                                                              *
                                                                                                                                                                                                                                                                              * <ReactScrollPagination
                                                                                                                                                                                                                                                                                  fetchFunc = {targetFuc}
                                                                                                                                                                                                                                                                                  totalPages = {totalPages}
                                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                              */

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jQuery = require('jquery');

var ReactScrollPagination = _react2.default.createClass({
  displayName: 'ReactScrollPagination',

  propTypes: {
    fetchFunc: _react.PropTypes.func.isRequired,
    totalPages: _react.PropTypes.number,
    paginationShowTime: _react.PropTypes.oneOfType([_react.PropTypes.number, // How long shall the pagination div shows
    _react.PropTypes.string]),
    excludeElement: _react.PropTypes.string, // The element selector which should be excluded from calculation
    excludeHeight: _react.PropTypes.oneOfType([_react.PropTypes.number, // the height value which should be excluded from calculation
    _react.PropTypes.string]),
    outterDivStyle: _react.PropTypes.object, // Style of the outter Div element
    innerDivStyle: _react.PropTypes.object, // Style of the inner Div element
    triggerAt: _react.PropTypes.oneOfType([_react.PropTypes.number, // The distance to trigger the fetchfunc
    _react.PropTypes.string])
  },
  isolate: {
    onePageHeight: null,
    timeoutFuncHandler: null,
    excludeHeight: null,
    triggerAt: null,
    showTime: null,
    defaultShowTime: 2000,
    defaultTrigger: 30,
    defaultExcludeHeight: 0
  },
  pageDivStle: {
    position: 'fixed',
    bottom: '15px',
    left: 0,
    right: 0,
    textAlign: 'center'
  },
  pageContentStyle: {
    display: 'inline-block',
    background: 'rgba(6, 6, 6, 0.54)',
    borderRadius: '5px',
    padding: '3px 15px',
    minWidth: '80px',
    color: '#fff',
    textAlign: 'center',
    margin: '0 auto',
    opacity: 1,
    WebkitTransition: 'opacity 0.8s',
    MozTransition: 'opacity 0.8s',
    OTransition: 'opacity 0.8s',
    transition: 'opacity 0.8s'
  },
  getInitialState: function getInitialState() {
    return {
      currentPage: 1,
      totalPages: null,
      showPageStatus: false
    };
  },

  showPagePositionDiv: function showPagePositionDiv() {
    var _this = this;

    if (this.isolate.timeoutFuncHandler) {
      clearTimeout(this.isolate.timeoutFuncHandler);
    }
    this.setState({ showPageStatus: true });

    this.isolate.timeoutFuncHandler = setTimeout(function () {
      _this.setState({ showPageStatus: false });
    }, this.isolate.showTime);
  },
  getShowTime: function getShowTime() {
    var showTime = this.isolate.defaultShowTime;
    if (this.props.paginationShowTime) {
      showTime = parseInt(this.props.paginationShowTime);
      if (isNaN(showTime)) {
        showTime = this.isolate.defaultShowTime;
        console.error('WARNING: Failed to convert props "paginationShowTime" to Number with value: "' + this.props.paginationShowTime + '". Will take ' + this.isolate.defaultShowTime + ' by default.');
      }
    }
    return showTime;
  },

  getExcludeHeight: function getExcludeHeight() {
    // 获取需要减去的高度
    var excludeHeight = this.isolate.defaultExcludeHeight;

    if (this.props.excludeHeight) {
      var propsExcludeHeight = parseInt(this.props.excludeHeight);
      if (isNaN(propsExcludeHeight)) {
        console.error('WARNING: Failed to convert the props "excludeHeight" with value: "' + this.props.excludeHeight + '" to Number, please verify. Will take "' + this.isolate.defaultExcludeHeight + '" by default.');
      } else {
        excludeHeight = propsExcludeHeight;
      }
    } else if (this.props.excludeElement && typeof this.props.excludeElement === 'string') {
      var excludeEle = jQuery(this.props.excludeElement);

      if (excludeEle.size() === 0) {
        console.error('WARNING: Failed to get the element with given selector "' + this.props.excludeElement + '", please veirify. Will take "' + this.isolate.defaultExcludeHeight + '" by default.');
      } else {
        excludeHeight = excludeEle.height();
      }
    }
    this.isolate.excludeHeight = excludeHeight;

    return excludeHeight;
  },

  getTriggerAt: function getTriggerAt() {
    var triggerAt = this.isolate.defaultTrigger;

    if (this.props.triggerAt) {
      triggerAt = parseInt(this.props.triggerAt);

      if (isNaN(triggerAt)) {
        triggerAt = this.isolate.defaultTrigger;

        console.error('WARNING: Failed to convert the props "triggerAt" to number with value: "' + this.props.triggerAt + '". Will take 30px by default.');
      }
    }

    return triggerAt;
  },

  getOnePageHeight: function getOnePageHeight() {
    var documentHeight = jQuery(document).height();

    /*
    * 当totalPages第一次有值时，表明List是初次加载，此时计算页面的高度，并将其作为单页的高度
    * 如果页面有固定的顶部头，通过 excludeHeight 将其减去
    */
    if (typeof this.props.totalPages === 'number' && this.props.totalPages > 0 && this.isolate.onePageHeight === null) {
      this.isolate.onePageHeight = documentHeight - this.isolate.excludeHeight;
    }
  },
  handlePagePosition: function handlePagePosition() {
    this.getOnePageHeight();

    var windowHeight = jQuery(window).height();
    var scrollTop = jQuery(window).scrollTop() + windowHeight - this.isolate.excludeHeight;

    if (this.isolate.onePageHeight !== null) {
      var currentPage = Math.ceil(scrollTop / this.isolate.onePageHeight) || 1;
      this.setState({ currentPage: currentPage });
      this.showPagePositionDiv();
    }
  },

  scrollHandler: function scrollHandler() {
    var documentHeight = jQuery(document).height();

    var windowHeight = jQuery(window).height();
    var scrollBottom = jQuery(window).scrollTop() + windowHeight;
    var triggerBottom = scrollBottom + this.isolate.triggerAt;

    // 当滚动条距离底部距离小于30像素的时候出发请求操作
    if (triggerBottom >= documentHeight) {
      this.props.fetchFunc();
    }

    this.handlePagePosition();
  },

  validateAndSetPropValues: function validateAndSetPropValues() {
    this.isolate.triggerAt = this.getTriggerAt();
    this.isolate.excludeHeight = this.getExcludeHeight();
    this.isolate.showTime = this.getShowTime();
  },

  componentWillUnmount: function componentWillUnmount() {
    jQuery(window).unbind('scroll', this.scrollHandler);
  },

  componentDidMount: function componentDidMount() {
    this.validateAndSetPropValues();
    jQuery(window).scroll(this.scrollHandler);
  },

  extend: function (_extend) {
    function extend() {
      return _extend.apply(this, arguments);
    }

    extend.toString = function () {
      return _extend.toString();
    };

    return extend;
  }(function () {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key)) {
          if (_typeof(arguments[0][key]) === 'object' && _typeof(arguments[i][key]) === 'object') {
            extend(arguments[0][key], arguments[i][key]);
          } else {
            arguments[0][key] = arguments[i][key];
          }
        }
      }
    }
    return arguments[0];
  }),

  render: function render() {
    // if no totalPages presented, will only do the fetchings
    if (typeof this.props.totalPages === 'undefined') {
      return null;
    }

    var acutalPageContentDivStyle = this.extend({}, this.props.innerDivStyle || this.pageContentStyle);

    // always set the opacity for inner div, so they are able to make the transition
    if (!this.state.showPageStatus) {
      acutalPageContentDivStyle.opacity = 0;
    }

    return _react2.default.createElement(
      'div',
      { style: this.props.outterDivStyle || this.pageDivStle },
      _react2.default.createElement(
        'div',
        { style: acutalPageContentDivStyle, className: 'react-scroll-pagination-inner-div' },
        _react2.default.createElement(
          'span',
          null,
          this.state.currentPage
        ),
        '/',
        _react2.default.createElement(
          'span',
          null,
          this.props.totalPages || 1
        )
      )
    );
  }
});

exports.default = ReactScrollPagination;