'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jQuery = require('jquery'); /**
                                * 在页面滚动的时候，监听滚动事件，在快要到达底部指定距离的时候，执行相应函数
                                *
                                * <ReactScrollPagination
                                    fetchFunc = {targetFuc}
                                    totalPages = {totalPages}
                                  />
                                */

var ReactScrollPagination = _react2.default.createClass({
  displayName: 'ReactScrollPagination',

  propTypes: {
    fetchFunc: _react.PropTypes.func.isRequired,
    totalPages: _react.PropTypes.number.isRequired,
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
    timeoutFunc: null,
    excludeHeight: null,
    triggerAt: null,
    showTime: null,
    defaultShowTime: 2000,
    defaultTrigger: 15,
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
  showPageDiv: function showPageDiv() {
    var _this = this;

    if (this.isolate.timeoutFunc) {
      clearTimeout(this.isolate.timeoutFunc);
    }
    this.setState({ showPageStatus: true });

    this.isolate.timeoutFunc = setTimeout(function () {
      _this.setState({ showPageStatus: false });
    }, this.isolate.showTime);
  },
  getShowTime: function getShowTime() {
    var showTime = this.isolate.defaultShowTime;
    if (this.props.paginationShowTime) {
      showTime = parseInt(this.props.paginationShowTime);
      if (isNaN(showTime)) {
        showTime = this.isolate.defaultShowTime;
        console.error('WARN: Failed to convert props "paginationShowTime" to Number with value: "' + this.props.paginationShowTime + '". Will take 2000 by default.');
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
        console.error('WARN: Failed to convert the props "excludeHeight" with value: "' + this.props.excludeHeight + '" to Number, please verify. Will take "0" by default.');
      } else {
        excludeHeight = propsExcludeHeight;
      }
    } else if (this.props.excludeElement && typeof this.props.excludeElement === 'string') {
      var excludeEle = jQuery(this.props.excludeElement);

      if (excludeEle.size() === 0) {
        console.error('WARN: Failed to get the element with given selectdor "' + this.props.excludeElement + '", please veirify. Will take "0" by default.');
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
        console.error('WARN: Failed to convert the props "triggerAt" to number with value: "' + this.props.triggerAt + '". Will take 15px by default.');
      }
    }

    return triggerAt;
  },
  getOnePageHeight: function getOnePageHeight() {
    var documentHeight = jQuery(document).height();

    // 当totalPages第一次有值时，表明List是初次加载，此时计算页面的高度，并将其作为单页的高度
    // 鉴于页面有固定的顶部头，目前需要将其减去
    if (typeof this.props.totalPages === 'number' && this.props.totalPages > 0 && this.isolate.onePageHeight === null) {
      this.isolate.onePageHeight = documentHeight - this.isolate.excludeHeight;
    }
  },
  handlePageValue: function handlePageValue() {
    // 当totalPages第一次有值时，表明List是初次加载，此时计算页面的高度，并将其作为单页的高度
    // 鉴于页面有固定的顶部头，目前需要将其减去
    this.getOnePageHeight();

    var windowHeight = jQuery(window).height();
    var scrollTop = jQuery(window).scrollTop() + windowHeight - this.isolate.excludeHeight;

    if (this.isolate.onePageHeight !== null) {
      var currentPage = Math.ceil(scrollTop / this.isolate.onePageHeight) || 1;
      this.setState({ currentPage: currentPage });
      this.showPageDiv();
    }
  },
  scrollHanlder: function scrollHanlder() {
    var documentHeight = jQuery(document).height();

    var windowHeight = jQuery(window).height();
    var scrollBottom = jQuery(window).scrollTop() + windowHeight;

    // 当滚动条距离底部距离小于30像素的时候出发请求操作
    if (scrollBottom + this.isolate.triggerAt >= documentHeight) {
      this.props.fetchFunc();
    }
    this.handlePageValue();
  },
  validateAndGetPropValues: function validateAndGetPropValues() {
    // validate the passed props and set them to isolate value
    this.isolate.triggerAt = this.getTriggerAt();
    this.isolate.excludeHeight = this.getExcludeHeight();
    this.isolate.showTime = this.getShowTime();
  },
  componentWillUnmount: function componentWillUnmount() {
    jQuery(window).unbind('scroll', this.scrollHanlder);
  },
  componentDidMount: function componentDidMount() {
    this.validateAndGetPropValues();
    jQuery(window).scroll(this.scrollHanlder);
  },

  render: function render() {
    var acutalPageContentDivStyle = jQuery.extend({}, this.props.innerDivStyle || this.pageContentStyle);

    // 即便是传入的innerDiv，也设置opacity，方便调用者实现opacity的transition效果
    if (!this.state.showPageStatus) {
      acutalPageContentDivStyle.opacity = 0;
    }

    // let actualDiv = this.state.showPageStatus ? withPageDiv : null
    return _react2.default.createElement(
      'div',
      { style: this.props.outterDivStyle || this.pageDivStle },
      _react2.default.createElement(
        'div',
        { style: acutalPageContentDivStyle },
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