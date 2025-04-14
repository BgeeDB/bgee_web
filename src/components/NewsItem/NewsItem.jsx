import Bulma from '../Bulma';
import { useNavigate } from 'react-router';
// import ReactMarkdown from 'react-markdown';
// import rehypeHighlight from 'rehype-highlight';
// import rehypeSanitize from 'rehype-sanitize';
// import rehypeRaw from 'rehype-raw';
// import rehypeSlug from 'rehype-slug';
// import rehypeLink from '../../helpers/rehypeLink';

const NewsItem = ({ date, News }) => {
  const navigate = useNavigate();

  return (
    <Bulma.Columns>
      <Bulma.C size={2}>
        <p className="has-text-centered has-text-weight-bold">{date}</p>
      </Bulma.C>
      <Bulma.C size={10}>
        <News></News>
        {/* <ReactMarkdown
          children={News}
          // rehypePlugins={[
          //   rehypeHighlight,
          //   rehypeSanitize,
          //   rehypeRaw,
          //   rehypeSlug,
          //   rehypeLink(navigate),
          // ]}
        /> */}
      </Bulma.C>
    </Bulma.Columns>
  );
};

export default NewsItem;
