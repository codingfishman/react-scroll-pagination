'use strict'

jest.unmock('../src/index.jsx')

import React from 'react'
import ReactDOM from 'react-dom'

import TestUtils from 'react-dom/test-utils'
import ReactScrollPagination from '../src/index.jsx'

describe('ReactScrollPagination', () => {
  let fetchFunc = null
  let mockConsoleWarn = null
  let mockConsoleError = null
  beforeEach(() => {
    fetchFunc = jest.fn()
    mockConsoleError = jasmine.createSpy('error')
    mockConsoleWarn = jasmine.createSpy('warn')
    window.console.error = mockConsoleError
    window.console.warn = mockConsoleWarn
  })

  afterEach(() => {
    jest.unmock('console')
  })

  it('Should console the error when required props "fetchFunc" is not presented', () => {

    const reactScrollPagination = TestUtils.renderIntoDocument(
      <ReactScrollPagination />
    )

    expect(mockConsoleError.calls.count()).toEqual(1)
  })

  it('Should not display the pagination div when no "totalPages" provided', () => {
    const reactScrollPagination = TestUtils.renderIntoDocument(
      <ReactScrollPagination fetchFunc={fetchFunc} />
    )
    const reactScrollPaginationNode = ReactDOM.findDOMNode(reactScrollPagination)
    expect(reactScrollPaginationNode).toEqual(null)
    expect(mockConsoleWarn.calls.count()).toEqual(1)
  })

  describe('Test the props "paginationShowTime" ', () => {
    it('Should initiate the showTime correctly when it\'s a valid number', () => {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} paginationShowTime='1500' />
      )

      expect(reactScrollPagination.isolate.showTime).toBe(1500)
    })

    it(' Should handle correctly when it\s not a valid number', () => {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} paginationShowTime='not1500' />
      )

      expect(reactScrollPagination.isolate.showTime).toEqual(reactScrollPagination.isolate.defaultShowTime)

      expect(mockConsoleError).toHaveBeenCalledWith('WARNING: Failed to convert props "paginationShowTime" to Number' +
        ' with value: "not1500". Will take 2000 by default.')
    })
  })

  describe('Test the props "excludeElement" ', () => {
    beforeEach(() => {
       document.body.innerHTML = '<div id="navbar" style="height:70px;" > navbar1 </div>'
    })

    it('Should take default value if the props is not presented ', ()=> {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} />
      )

      expect(reactScrollPagination.isolate.excludeHeight).toBe(0)
    })

    it('Should initiate the excludeHeight with the correct element\'s height', () => {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} excludeElement='#navbar' />
      )
      expect(reactScrollPagination.isolate.excludeHeight).toBe(70)
    })

    it(' Should handle correctly when the presented selectdor is not available', () => {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} excludeElement='.navbar' />
      )

      expect(mockConsoleError).toHaveBeenCalledWith('WARNING: Failed to get the element with given selector ".navbar'
          + '", please veirify. Will take "0" by default.')
    })
  })

  describe('Test the props "excludeHeight"', () => {
    it('Should take the default value if the props is not presented', () => {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} />
      )
      expect(reactScrollPagination.isolate.excludeHeight).toBe(0)
    })

    it('Should initiate the value correctly with available number value', () => {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} excludeHeight={20} />
      )
      expect(reactScrollPagination.isolate.excludeHeight).toBe(20)
    })

    it('Should initiate the value correctly with available pixer value', () => {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} excludeHeight='30px' />
      )
      expect(reactScrollPagination.isolate.excludeHeight).toBe(30)
    })

    it('Should echo errors with invalid props value', () => {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} excludeHeight='not20' />
      )
      expect(reactScrollPagination.isolate.excludeHeight).toBe(0)
      expect(mockConsoleError).toHaveBeenCalledWith('WARNING: Failed to convert the props "excludeHeight" with value:' +
        ' "not20" to Number, please verify. Will take "0" by default.')
    })

    it('Should take it a higher priority over "exludeElement" if both are presented', () => {
      document.body.innerHTML = '<nav id="navbar" style="height:70px" > navbar1 </nav>'
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} excludeHeight='20' excludeElement='#navbar' />
      )

      expect(reactScrollPagination.isolate.excludeHeight).toBe(20)
    })
  })

  describe('Test the props "triggerAt" ', () => {
    it('Should take defualt value when no value presented', () => {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} />
      )
      expect(reactScrollPagination.isolate.triggerAt).toBe(30)
    })

    it('Should initiate the value correctly when available value presented', () => {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} triggerAt='50' />
      )
      expect(reactScrollPagination.isolate.triggerAt).toBe(50)
    })

    it('Should initiate the value correctly when available pixer value presented', () => {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} triggerAt='60px' />
      )
      expect(reactScrollPagination.isolate.triggerAt).toBe(60)
    })

    it('Should echo erorrs with invalid props value', () => {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} triggerAt='not60' />
      )
      expect(reactScrollPagination.isolate.triggerAt).toBe(30)
      expect(mockConsoleError).toHaveBeenCalledWith('WARNING: Failed to convert the props "triggerAt" to number with' +
       ' value: "not60". Will take 30px by default.')
    })
  })

  describe('Test the props "outterDivStyle', () => {
    it('Should override the outter div style when presented', () => {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} totalPages={15} outterDivStyle={{width:'100px', margin:'15px'}} />
      )
      const reactScrollPaginationNode = ReactDOM.findDOMNode(reactScrollPagination)
      expect(reactScrollPaginationNode.style.width).toEqual('100px')
      expect(reactScrollPaginationNode.style.margin).toEqual('15px')
    })
  })

  describe('Test the props "innerDivStyle"', () => {
    it('Should override the inner div style when presented', () => {
      const reactScrollPagination = TestUtils.renderIntoDocument(
        <ReactScrollPagination fetchFunc={fetchFunc} totalPages={15} innerDivStyle={{width:'100px', margin:'15px'}} />
      )
      const reactScrollPaginationNode = ReactDOM.findDOMNode(reactScrollPagination)
      const innerDivNode = ReactDOM.findDOMNode(TestUtils.findRenderedDOMComponentWithClass(reactScrollPagination,
        'react-scroll-pagination-inner-div'))

      expect(innerDivNode.style.width).toEqual('100px')
      expect(innerDivNode.style.margin).toEqual('15px')
    })
  })

})
