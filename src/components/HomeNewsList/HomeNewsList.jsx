import {Link} from "react-router";
import PATHS from "../../paths/paths";
import Bulma from '../Bulma';
import NewsItem from '../NewsItem';

// // import all markdown files in the news directory
// const markdownFiles = require.context('../../markdown/news', false, /\.md$/);
// const news = markdownFiles.keys().map((path) => {
//   // get the filename from the path
//   const filename = path.replace(/^.*[\\/]/, '');
//   // e.g. News-2023-04-24.md
//   const date = filename.replace(/^News-(.*)\.md$/, "$1");

//   // import the markdown file
//   const markdown = markdownFiles(path).default;

//   // return an object with filename and markdown
//   return { date, markdown };
// });
// const lastNews = news[news.length - 1];

// Import all markdown files in the news directory
const markdownFiles = import.meta.glob('../../markdown/news/*.md', { eager: true });
const news = Object.entries(markdownFiles).map(([path, module]) => {
  // get the filename from the path
  const filename = path.replace(/^.*[/\\]/, '');
  // e.g. News-2023-04-24.md
  const date = filename.replace(/^News-(.*)\.md$/, "$1");

  // get the markdown content
  const markdown = module.default;

  // return an object with filename and markdown
  return { date, markdown };
});
const lastNews = news[news.length - 1];

const HomeNewsList = () => (
  <>
    <Bulma.Card.Header>
      <Bulma.Card.Header.Title className="is-size-3 has-text-primary">
        Bgee News
      </Bulma.Card.Header.Title>
      <Bulma.Card.Header.Icon>
        <Link className="internal-link" to={PATHS.ABOUT.NEWS}>
          See all news
        </Link>
      </Bulma.Card.Header.Icon>

    </Bulma.Card.Header>
    <Bulma.Card.Body style={{ overflowY: 'auto' }}>
      <div className="content">
        <NewsItem date={lastNews.date} News={lastNews.markdown} />
      </div>
    </Bulma.Card.Body>
  </>
);

export default HomeNewsList;
