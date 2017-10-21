/**
* 在页面滚动的时候，监听滚动事件，在快要到达底部指定距离的时候，执行相应函数
* 如果传入 totalPages, 则会在鼠标滚动时
*
* <ReactScrollPagination
    fetchFunc = {targetFuc}
    totalPages = {totalPages}
  />
*/

import { Component } from 'react'
import PropTypes from 'prop-types'

export default class ReactScrollPagination extends Component {
  static defaultProps = {
    totalPages: null,
  }

  static propTypes = {
    fetchFunc: PropTypes.func.isRequired,
    totalPages: PropTypes.number,
    paginationShowTime: PropTypes.oneOfType([
      PropTypes.number, // How long shall the pagination div shows
      PropTypes.string
    ]),
    excludeElement: PropTypes.string, // The element selector which should be excluded from calculation
    excludeHeight: PropTypes.oneOfType([
      PropTypes.number, // the height value which should be excluded from calculation
      PropTypes.string
    ]),
    outterDivStyle: PropTypes.object, // Style of the outter Div element
    innerDivStyle: PropTypes.object, // Style of the inner Div element
    triggerAt: PropTypes.oneOfType([
      PropTypes.number, // The distance to trigger the fetchfunc
      PropTypes.string
    ]),
  }

  isolate = {
    onePageHeight: null,
    timeoutFuncHandler: null,
    excludeHeight: null,
    triggerAt: null,
    showTime: null,
    defaultShowTime: 2000,
    defaultTrigger: 30,
    defaultExcludeHeight: 0
  }

  pageDivStle = {
    position: 'fixed',
    bottom: '15px',
    left: 0,
    right: 0,
    textAlign: 'center'
  }

  pageContentStyle = {
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
  }

  state = {
    currentPage: 1,
    totalPages: this.props.totalPages,
    showPageStatus: false
  }

  showPagePositionDiv = () => {
    if (this.isolate.timeoutFuncHandler) {
      clearTimeout(this.isolate.timeoutFuncHandler)
    }
    this.setState({showPageStatus: true})

    this.isolate.timeoutFuncHandler = setTimeout(() => {
      this.setState({showPageStatus: false})
    }, this.isolate.showTime)
  }

  getShowTime = () => {
    let showTime = this.isolate.defaultShowTime
    if (this.props.paginationShowTime) {
      showTime = parseInt(this.props.paginationShowTime)
      if (isNaN(showTime)) {
        showTime = this.isolate.defaultShowTime
        console.error('WARNING: Failed to convert props "paginationShowTime" to Number with value: "' +
          this.props.paginationShowTime + '". Will take ' + this.isolate.defaultShowTime + ' by default.')
      }
    }
    return showTime
  }

  getExcludeHeight = () => {
    // 获取需要减去的高度
    let excludeHeight = this.isolate.defaultExcludeHeight

    if (this.props.excludeHeight) {
      let propsExcludeHeight = parseInt(this.props.excludeHeight)
      if (isNaN(propsExcludeHeight)) {
        console.error('WARNING: Failed to convert the props "excludeHeight" with value: "' + this.props.excludeHeight +
          '" to Number, please verify. Will take "' + this.isolate.defaultExcludeHeight + '" by default.')
      } else {
        excludeHeight = propsExcludeHeight
      }

    } else if (this.props.excludeElement && typeof this.props.excludeElement === 'string') {
      let excludeEle = document.querySelector(this.props.excludeElement)

      if (excludeEle) {
        excludeHeight = excludeEle.offsetHeight
      } else {
        console.error('WARNING: Failed to get the element with given selector "' + this.props.excludeElement +
          '", please veirify. Will take "' + this.isolate.defaultExcludeHeight + '" by default.')
      }
    }
    this.isolate.excludeHeight = excludeHeight

    return excludeHeight
  }

  getTriggerAt = () => {
    let triggerAt = this.isolate.defaultTrigger

    if (this.props.triggerAt) {
      triggerAt= parseInt(this.props.triggerAt)

      if (isNaN(triggerAt)) {
        triggerAt = this.isolate.defaultTrigger

        console.error('WARNING: Failed to convert the props "triggerAt" to number with value: "' +
          this.props.triggerAt + '". Will take 30px by default.')
      }
    }

    return triggerAt
  }

  getOnePageHeight = () => {
    const documentHeight = this.documentHeight()

    /*
    * 当totalPages第一次有值时，表明List是初次加载，此时计算页面的高度，并将其作为单页的高度
    * 如果页面有固定的顶部头，通过 excludeHeight 将其减去
    */
    if (typeof this.props.totalPages === 'number' && this.props.totalPages > 0 && this.isolate.onePageHeight === null) {
      this.isolate.onePageHeight = documentHeight - this.isolate.excludeHeight
    }
  }

  handlePagePosition = () => {
    this.getOnePageHeight()

    let scrollBottom = this.scrollTop() + this.windowHeight() - this.isolate.excludeHeight

    if (this.isolate.onePageHeight !== null) {
      let currentPage = Math.ceil(scrollBottom / this.isolate.onePageHeight) || 1
      this.setState({currentPage: currentPage})
      this.showPagePositionDiv()
    }
  }

  windowHeight = () => {
    return Math.max(document.body.clientHeight, window.innerWidth)
  }

  documentHeight = () => {
    return Math.max(this.windowHeight(), document.documentElement.clientHeight,
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight)
  }

  scrollTop = () => {
    return window.pageYOffset || document.documentElement.scrollTop
  }

  scrollHandler = () => {
    let scrollBottom = this.scrollTop() + this.windowHeight()
    let triggerBottom = scrollBottom + this.isolate.triggerAt

    // 当滚动条距离底部距离小于30像素的时候出发请求操作
    if (triggerBottom >= this.documentHeight()) {
      this.props.fetchFunc()
    }

    this.handlePagePosition()
  }

  validateAndSetPropValues = () => {
    this.isolate.triggerAt = this.getTriggerAt()
    this.isolate.excludeHeight = this.getExcludeHeight()
    this.isolate.showTime = this.getShowTime()
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.scrollHandler)
  }

  componentDidMount = () => {
    this.validateAndSetPropValues()
    window.addEventListener('scroll', this.scrollHandler)
  }

  render = () => {
    // if no totalPages presented, will only do the fetchings
    if (typeof this.props.totalPages === 'undefined') {
      return (null)
    }

    let acutalPageContentDivStyle = Object.assign({}, this.props.innerDivStyle || this.pageContentStyle)

    // always set the opacity for inner div, so they are able to make the transition
    if (!this.state.showPageStatus) {
      acutalPageContentDivStyle.opacity = 0
    }

    return (
      <div style={this.props.outterDivStyle || this.pageDivStle} >
        <div style={acutalPageContentDivStyle} className='react-scroll-pagination-inner-div'>
          <span >
            {this.state.currentPage}
          </span>
          /
          <span >
            {this.props.totalPages || 1}
          </span>
        </div>
      </div>
    )
  }
}
