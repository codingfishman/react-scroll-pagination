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
    paginationShowTime: _react.PropTypes.oneOfType([_react.PropTypes.number, // 控制分页详情div的显示时间，单位为毫秒数
    _react.PropTypes.string]),
    excludeElement: _react.PropTypes.string, // 需要减去高度的元素，当要减去的高度是不固定的，可传入元素选择器，插件会自己计算其高度
    excludeHeight: _react.PropTypes.oneOfType([_react.PropTypes.number, // 需要减去的高度，将会从单页高度 onePageHeight 中减去，优先级高于 excludeElement
    _react.PropTypes.string]),
    outterDivStyle: _react.PropTypes.object, // 控制最外层Div的style
    innerDivStyle: _react.PropTypes.object // 内存Div的style
  },
  isolate: {
    onePageHeight: null,
    timeoutFunc: null,
    excludeHeight: null,
    defaultShowTime: 2000
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
    var showTime = this.props.paginationShowTime ? parseInt(this.props.paginationShowTime) : this.isolate.defaultShowTime;

    this.isolate.timeoutFunc = setTimeout(function () {
      _this.setState({ showPageStatus: false });
    }, showTime);
  },
  getExcludeHeight: function getExcludeHeight() {
    if (this.isolate.excludeHeight !== null) {
      return this.isolate.excludeHeight;
    }
    // 获取需要减去的高度
    var excludeHeight = 0;

    if (this.props.excludeHeight) {
      var propsExcludeHeight = parseInt(this.props.excludeHeight);
      if (isNaN(propsExcludeHeight)) {
        console.error('WARN: Failed to convert the props excludeHeight "' + this.props.excludeHeight + '" to Number, please verify. Will take "0" by default.');
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
  initialOnePageHeight: function initialOnePageHeight() {
    var documentHeight = jQuery(document).height();

    // 当totalPages第一次有值时，表明List是初次加载，此时计算页面的高度，并将其作为单页的高度
    // 鉴于页面有固定的顶部头，目前需要将其减去
    if (typeof this.props.totalPages === 'number' && this.props.totalPages > 0 && this.isolate.onePageHeight === null) {
      var excludeHeight = this.getExcludeHeight();
      this.isolate.onePageHeight = documentHeight - excludeHeight;
    }
  },
  handlePageValue: function handlePageValue() {
    // 当totalPages第一次有值时，表明List是初次加载，此时计算页面的高度，并将其作为单页的高度
    // 鉴于页面有固定的顶部头，目前需要将其减去
    this.initialOnePageHeight();

    var windowHeight = jQuery(window).height();
    var scrollTop = jQuery(window).scrollTop() + windowHeight - this.getExcludeHeight();

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
    if (scrollBottom + 30 >= documentHeight) {
      this.props.fetchFunc();
    }
    this.handlePageValue();
  },
  componentWillUnmount: function componentWillUnmount() {
    jQuery(window).unbind('scroll', this.scrollHanlder);
  },
  componentDidMount: function componentDidMount() {
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