import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkToc from 'remark-toc';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import { useNavigate } from 'react-router';
import ROUTES from '../paths/routes';
import classnames from '../helpers/classnames';
import Bulma from '../components/Bulma';
import rehypeLink from '../helpers/rehypeLink';

const MarkdownReader = ({ location: { pathname } }) => {
  const navigate = useNavigate();
  const components = React.useMemo(
    () => ({
      h1: ({ children, id }) => (
        <div className={classnames('content has-text-centered')}>
          <h1 className="title in-md is-5" id={id}>
            {children}
          </h1>
        </div>
      ),
      h2: ({ children, id }) => (
        <Bulma.Title id={id} renderAs="h2" size={5} className="gradient-underline">
          {children}
        </Bulma.Title>
      ),
      p: ({ children }) => <p className="mb-1">{children}</p>,
      // Rewrite `em`s (`*like so*`) to `i` with a red foreground color.
      // em: ({ node, ...props }) => <i style={{ color: 'red' }} {...props} />,
    }),
    []
  );

  return (
    <>
      <ReactMarkdown
        className="markdown"
        components={components}
        children={ROUTES[pathname].source}
        remarkPlugins={[remarkGfm, remarkToc]}
        rehypePlugins={[rehypeHighlight, rehypeSanitize, rehypeRaw, rehypeSlug, rehypeLink(navigate)]}
      />
    </>
  );
};

export default MarkdownReader;
