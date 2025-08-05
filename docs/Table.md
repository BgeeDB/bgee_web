# Properties

`Table.js`

```
fullwidth: boolean (default true)
classNames: string
title: string | undefined
columns: [] of {
        key: string,
        text: string
        style: CSS Object
        hide: MEDIA_QUERIES
    }
data: [] of Objects
onFilter: function (see details below)
sortable: boolean (allow mono sorting)
multiSortable: boolean (allow multi sorting)
onSortCustom: function (see explanation below)
onRenderCell: function | undefined (custom cell rendering when logic need to be apply for the rendering or custom rendering)
onRenderRow: function | undefined (custom row classname rendering)
striped: boolean (striped rows)
pagination: boolean
defaultPaginationSize: number (default = 10)
customHeader: () => React.Component
mappingObj: (object, key) => object
identifierAtFilter: boolean (default false) (if true, the identifier column will be added when filtering active, allowing the user to know the place of the rows in the table not filtered)
```

### Columns

Here are the details of the `columns` property.
More details can be found for the adaptive design below.

```typescript jsx
interface Column {
  key: string; // use to identify the column in onRenderCell
  text: string; // text to be display for the header of the column
  hide: string | number; // adaptative design
  style: CSSOptions;
  noSort: boolean; // if true, the column will not be sortable
}

const columns: Column[] = [
  //
];
```

### Data

The data should be an array of any type (array of rows). Depending on your way of working you could format the row in an object or an array.
If you want to minimize your code and impact, you can pass a function that you would do the mapping of your data the way you want through the `mappingObj`.

Here are the two format that data can take.

```typescript
const dataAsArrayOfObject = [
  {
    aaa: 'xxx1',
    bbb: 'xxx2',
    ccc: 'xxx3',
  },
  {
    aaa: 'yyy1',
    bbb: 'yyy2',
    ccc: 'yyy3',
  },
  // ...
];

const dataAsArrayOfArray = [
  ['xxx1', 'xxx2', 'xxx3'],
  ['yyy1', 'yyy2', 'yyy3'],
  // ...
];
```

### Filtering

If you want to enable the filtering function, you have to provide a filtering function.
This function will tell the table which column(s) or data should be used for the filtering.
Do not forget to pass a custom header, that's where you can put the input for the filter. (see `Custom Header` below)

```typescript jsx
interface Object {
  [key: string]: any;
}
const onFilter =
  (stringTiFilter: string) =>
  (element: Object): boolean => {
    //  insert your logic, you should return a boolean to determine if it matches your filtering or not
  };
```

### Sorting

The sorting can be simple or multiple.
This should be enabled through the props `sortable` and `multiSortable`.

```typescript jsx
interface SortOption {
  key: string;
  sort: 'ascending' | 'descending';
}

const onSortCustom =
  (sortOpts: SortOption | SortOption[]) =>
  (a: any, b: any): -1 | 0 | 1 => {
    //  sortOpts is SortOption   if it's a single sorting
    //  sortOpts is SortOption[] if it's a multi  sorting
  };
```

You can also define a default sorting by using the property `initialSorting`.
You just have to use the same format as `sortOpts` above.

### Rendering Cell

Allow the user to customize the rendering of every cell of the table.
The content returned is directly insert into the `td` tag.
Any logic can be applied across the information of the row.
It's also here that should be handled the fact that the row is expanding or not.

Depending on the format of the data, each row is an array or an object, the value of the cell will differ.
Here is the description of the function that should be passed as `onRenderCell`.

```typescript jsx
interface ObjectRow {
  cell: object; // the object representing the row data
  key: number | string; // the key of the column or its id
  key: number; // the id of the row
}
interface ArrayRow {
  cell: any; // the value of the cell
  key: number; // the id of the cell
  keyRow: number; // the id of the row
}
const onRenderCell = (
  data: ObjectRow | ArrayRow, // be careful of the format of your data
  defaultRender: (cell, cellKey) => React.Element,
  expandProps: {
    expandAction: () => void;
    isExpanded: boolean;
  }
): React.Element | string => {
  /*
  ... your logic
   */
};
```

### Rendering Row

Allow the user to customize the style of the `tr` tag.
The usage here is to compare the current row and the previous one, depending of the gap between the value we had to display a separator between them (see gene expression table, in the gene page)

Here is the description of the function that should be passed as `onRenderRow`.

```typescript
const onRenderRow = (currentRow: object, previousRow: object | null, currentKey: number): string => {
  /*
  ... your logic
   */
  return '___classnames___';
};
```

### Pagination

The properties specific of the pagination are the following:

```typescript
{
  pagintion: boolean; // default is false
  defaultPaginationSize: number; // default is 10
}
```

You just have to enable the pagination, and all the elements of the pagination will be displayed as:

- the counter (Showing X to Y of Z entries) (in the footer on the left of the table)
- the buttons to navigate through the different pages (in the footer on the right of the table)

If you want to let the user change the size of the page (see `Custom Header` below).

### Custom Header

If you need to use the filter or the pagination change switcher, you will have to use the property `customHeader`.
It also allows you to add a header to the table.

Here is the format of the function that should be passed.

```typescript jsx
const customHeader= (searchInput: React.Element, pageSizeSelector: React.Element, data: any[]): React.Element => (
  <div>
    {searchInput}
    {pageSizeSelector}
  </div>
);
```

# Adaptive Design

The table can be configured to listen the size of the table.
We can easily configure at which media query hide or show the columns.

To configure the header and the visibility of the header follow the template below.

```javascript
const columns = [
  {
    key: 'taxonName',
    text: 'Taxon Name',
    // `hide` key will hide the columns when the table will have a width inferior at the size configure (`hide` value)
    hide: MEDIA_QUERIES_SIZE[MEDIA_QUERY.TABLET], // these are constants used to easily maintain the code
  },
];
```
