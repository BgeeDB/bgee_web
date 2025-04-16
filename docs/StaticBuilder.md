# Static Builder

This feature allows you to render html through static contents (JSON Object) with preformatted styles.
But you will always be able to customize the element by adding an `id` or a `classNames`.

The default styles are based on BulmaCSS, so the easier way to customize the elements are by using the BulmaCSS
class helpers. (ex: notification with `is-danger` or `is-primary`)

### Elements

There are 21 different elements, with their properties:

- Break Line

```ts
{
    type: 'break_line',
}
```

- Bold

```ts
{
    type: 'bold',
    content: string
}
```

- Card

```ts
{
    type: 'card',
    image: {
        alt: string,
        src: string,
    },
    imageClass: string,
    title: string,
    description: string,
    richDescription: Array of Elements,
}
```

- Columns

```ts
{
   type: 'columns',
   content: Array of  {
        size: number,
        content: Array of Elements,
        classNames: string
   }
}
```

- Grid

```ts
{
    type: 'grid',
    cols: number, // number of columns by row
    content: Array of Elements,
    fillRow: boolean, // fill the row with empty column or expand elements
}
```

- Link Anchor

```ts
{
    type: 'link_anchor',
    selector: string,
    text: string
}
```

- Link External

```ts
{
    type: 'link_external',
    path: string,
    text: string
}
```

- Link Image

```ts
{
    type: 'link_image',
    path: string,
    text: string
}
```

- Image (only)

```ts
{
    type: 'only_image',
    src: string,
    alt: string,
    style: string
}
```

- Link Internal

```ts
{
    type: 'link_internal',
    path: string,
    text: string
}
```

- Notification

```ts
{
    type: 'notification',
    content: string,
}
```

- Ordered List

```ts
{
    type: 'ordered_list',
    children: Array of Elements,
}
```

- Pre-formatted Code

```ts
{
    type: 'pre_code',
    content: string,
}
```

- Rich Text

```ts
{
    type: 'rich_text',
    content: Array of Rich Elements,
}
```

- Section

```ts
{
    type: 'section',
    title: string,
    children: Array of Elements
}
```

- Separator

```ts
{
    type: 'separator',
}
```

- Table

For a better understanding, please check the Table component.

```ts
{
    type: 'table',
    fullWidth: boolean,
    title: string,
    columns: Array of Objects,
    mappedData: Array of Objects,
    onRenderCell: ({
        cell,
        key: cellKey,
        keyRow
        }, defaultRender) => null | string | JSX.Element,
}
```

- Text

```ts
{
    type: 'text',
    content: string
}
```

- Title

```ts
{
    type: 'title',
    content: string,
}
```

- Unordered List

```ts
{
    type: 'unordered_list',
    children: Array of Elements,
}
```

#### Rich Elements

You can find all the elements that can be used in the Rich Text Elements.
Some are similar to the previous Elements.

- Break Line

```ts
{
    type: 'break_line',
}
```

- Bold

```ts
{
    type: 'bold',
    content: string
}
```

- Code

```ts
{
    type: 'code',
    content: string
}
```

- Italic

```ts
{
    type: 'italic',
    content: string
}
```

- Link Anchor

```ts
{
    type: 'link_anchor',
    selector: string
    text: string
}
```

- Link Internal

```ts
{
    type: 'link_internal',
    path: string
    text: string
}
```

- Link External

```ts
{
    type: 'link_external',
    path: string
    text: string
}
```

- Link Mail

```ts
{
    type: 'link_mail',
    email: string
    text: string
}
```

- Link Phone Number

```ts
{
    type: 'link_phone_number',
    phoneNumber: string
    text: string
}
```

- Pre-formatted Code

```ts
{
    type: 'xxx',
}
```

- Rich Text

```ts
{
    type: 'rich_text',
    content: Array of Rich Text Elements
}
```

- Text

```ts
{
    type: 'text',
    content: string
}
```

- Underline

```ts
{
    type: 'underline',
    content: string
}
```
