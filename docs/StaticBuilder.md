# Static Builder

This feature allows you to render html through static contents (JSON Object) with preformatted styles.
But you will always be able to customize the element by adding an `id` or a `classNames`.

The default styles are based on BulmaCSS, so the easier way to customize the elements are by using the BulmaCSS
class helpers. (ex: notification with `is-danger` or `is-primary`)

### Elements

There are 21 different elements, with their properties:

- Accordion

```
{
    type: 'accordion',
    children: Array of {title: string, body: Array of Elements}
}
```

- Break Line

```
{
    type: 'break_line',
}
```

- Bold

```
{
    type: 'bold',
    content: string
}
```

- Card

```
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

```
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

```
{
    type: 'grid',
    cols: number, // number of columns by row
    content: Array of Elements,
    fillRow: boolean, // fill the row with empty column or expand elements
}
```

- Link Anchor

```
{
    type: 'link_anchor',
    selector: string,
    text: string
}
```

- Link External

```
{
    type: 'link_external',
    path: string,
    text: string
}
```

- Link Image

```
{
    type: 'link_image',
    path: string,
    text: string
}
```

- Image (only)

```
{
    type: 'only_image',
    src: string,
    alt: string,
    style: string
}
```

- Link Internal

```
{
    type: 'link_internal',
    path: string,
    text: string
}
```

- Notification

```
{
    type: 'notification',
    content: string,
}
```

- Ordered List

```
{
    type: 'ordered_list',
    children: Array of Elements,
}
```

- Pre-formatted Code

```
{
    type: 'pre_code',
    content: string,
}
```

- Rich Text

```
{
    type: 'rich_text',
    content: Array of Rich Elements,
}
```

- Section

```
{
    type: 'section',
    title: string,
    children: Array of Elements
}
```

- Separator

```
{
    type: 'separator',
}
```

- Table

For a better understanding, please check the Table component.

```
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

```
{
    type: 'text',
    content: string
}
```

- Title

```
{
    type: 'title',
    content: string,
}
```

- Unordered List

```
{
    type: 'unordered_list',
    children: Array of Elements,
}
```

#### Rich Elements

You can find all the elements that can be used in the Rich Text Elements.
Some are similar to the previous Elements.

- Break Line

```
{
    type: 'break_line',
}
```

- Bold

```
{
    type: 'bold',
    content: string
}
```

- Code

```
{
    type: 'code',
    content: string
}
```

- Italic

```
{
    type: 'italic',
    content: string
}
```

- Link Anchor

```
{
    type: 'link_anchor',
    selector: string
    text: string
}
```

- Link Internal

```
{
    type: 'link_internal',
    path: string
    text: string
}
```

- Link External

```
{
    type: 'link_external',
    path: string
    text: string
}
```

- Link Mail

```
{
    type: 'link_mail',
    email: string
    text: string
}
```

- Link Phone Number

```
{
    type: 'link_phone_number',
    phoneNumber: string
    text: string
}
```

- Pre-formatted Code

```
{
    type: 'xxx',
}
```

- Rich Text

```
{
    type: 'rich_text',
    content: Array of Rich Text Elements
}
```

- Text

```
{
    type: 'text',
    content: string
}
```

- Underline

```
{
    type: 'underline',
    content: string
}
```
