/* eslint-disable react/no-children-prop,no-param-reassign,react/no-danger-with-children */
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import Bulma from '../Bulma';
import rehypeLink from '../../helpers/rehypeLink';

const NewsItem = ({ date, News }) => {
  const navigate = useNavigate();

  return (
    <Bulma.Columns>
      <Bulma.C size={2}>
        <p className="has-text-centered has-text-weight-bold">{date}</p>
      </Bulma.C>
      <Bulma.C size={10}>
        <ReactMarkdown
          children={News}
          rehypePlugins={[
            rehypeHighlight,
            rehypeSanitize,
            rehypeRaw,
            rehypeSlug,
            rehypeLink(navigate),
          ]}
        />
      </Bulma.C>
    </Bulma.Columns>
  );
};

export default NewsItem;
