# react-scroll-pagination
A React component to help the page with scrolling pagination. It will execute the fetching function when the scrollbal is close to the bottom in less than 30 pixers.

It will also show the paging status when scrolling, when it's **scrolling down and scrolling up**, include the *current page* and *total pages*, this is done by calculating the `document height` and `one page height`.

The pagination element will be displayed on the bottom of the window, with a bottom of `15px` in `fixed` position. I should set up a demo page, I know ;(.

ANY ISSUE YOU FOUND, PLEASE HELP LET ME KNOW :)

## Basic Usage
The code below demonstarted the basic use case with the component, we need to specify both `fetchFunc` and `totalPages` at least.

```js
import ReactScrollPagination from 'react-scroll-pagination'

// in the render function

render: function () {
  return (
    // some list item elements
    <ReactScrollPagination
      fetchFunc={theFuncToFetchNextPage}
      totalPages={totalPagesOfTheList}
    />
  )
}

```


## Configurable Props

### fetchFunc
`REQUIRED`

The function to be excuted while the scroll bar event is triggered, usally the one to fetch next page data.

**CAUTION:**
 As the function will be called everytime the scroll bar is close to bottom, it will be executed even when previous page has not been rendered yet, we need to handle and prevent the case inside the fetchFunc.

```js
function fetchFunc () {
  if (isRequesting) {
    // do nothing
    return
  }

  // otherwise, do the normal request
}
```

### totalPages
`REQUIRED`

We have to tell the component how many pages we totally have, it's hard to know :)

### paginationShowTime
`OPTIONAL`

`DEFAULT: 2000`

Specify how long shall the pagination element displays.

### excludeElement
`OPTIONAL`

`DEFAULT: null`

Usage:`excludeElement: '#nav-bar'`

> While the component is based on the **HEIGHT** of the document, it's quite sensible for the precision of height. And there are cases that the list is just part of the page, in most situations we have such as *Navbar* on the pate as well, and we need to deduct it from calculation.

This props speicfy the *selector* of the element which should be deduct from height calculation. The *selector* could be anything compatible with jQuery, as we use jQuery here. *Currently, only one element selector is supported.*

### excludeHeight
`OPTIONAL`

`DEFAULT: 0`

Usage: `excludeHeight: {50}`, or `execludeHeight: '50px'`

Similar to *excludeElement*, only this props specify the height directly. If both *excludeElement* and *excludeHeight* are specified, only the *excludeHeight* will work.

### outterDivStyle
`OPTIONAL`

DEFAULT:

```js
{
  position: 'fixed',
  bottom: '15px',
  left: 0,
  right: 0,
  textAlign: 'center'
}
```

Specify the style of outter element, who is actually the outter wrapper of inner pagination elements

### innerDivStyle
DEFAULT:

```js
{
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
```

Speicfy the style of inner element, who is actually the real DIV of the pagination details

## Full Usage

```js
render: function () {
  return (
    // some list item elements
    <ReactScrollPagination
      fetchFunc={theFuncToFetchNextPage}
      totalPages={totalPagesOfTheList}
      paginationShowTime=3000
      excludeElement='#nav-bar'
      excludeHeight=50
      outterDivStyle={}
      innerDivStyle={}
    />
  )
```
