We integrate the markdown feature by using the library `react-markdown`.
Please take a look at their documentation.

Here is how to integrate the feature.

```typescript jsx

import ReactMarkdown from 'react-markdown';

<ReactMarkdown
  children={ROUTES[pathname].source}
/>
```

## Custom plugins

### rehypeLink

The current need is to be able to do the difference between bgee.org link and others.
Depending on the link, the style and behavior will defer.

You can find the code at the following path:
`/src/helpers/rehypeLink.js`
