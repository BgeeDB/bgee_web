import Bulma from '~/components/Bulma';
import classnames from '~/helpers/classnames';
import type { MDXComponents } from 'mdx/types.js';
import { useNavigate } from 'react-router';

// https://mdxjs.com/guides/injecting-components/
export function useMDXComponents(): MDXComponents {
  const navigate = useNavigate();

  return {
    wrapper: (wrapperProps: any) => {
      // const { children, actionData, loaderData, ...restProps } = wrapperProps;
      const { children, ...restProps } = wrapperProps;
      return (
        <div className="markdown" {...restProps}>
          {children}
        </div>
      );
    },
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
    a: ({ children, href, className, 'data-internal-link': isInternal, ...props }) => {
      // Add custom link handling component for internal links
      const handleClick = (e) => {
        if (isInternal && href) {
          e.preventDefault();
          navigate(href.replace(window.location.origin, ''));
        }
      };
      return (
        <a href={href} className={className} onClick={isInternal ? handleClick : undefined} {...props}>
          {children}
        </a>
      );
    },
  };
}
