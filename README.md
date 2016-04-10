# react-scroll-pagination
A React component to help the page with scrolling pagination. It will execute the fetching function when the scrollbal is close to the bottom in less than 30 pixers. It will also show the paging status when scrolling, when it's **scroll down or scroll up**, include the *current page* and *total pages*.

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