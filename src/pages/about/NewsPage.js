import Bulma from '../../components/Bulma';
import GoTop from '../../components/GoTop';
import NewsItem from '../../components/NewsItem';

// import all markdown files in the news directory
const markdownFiles = require.context('../../markdown/news', false, /\.md$/);
const news = markdownFiles.keys().map((path) => {
  // get the filename from the path
  const filename = path.replace(/^.*[\\/]/, '');
  // e.g. News-2023-04-24.md
  const date = filename.replace(/^News-(.*)\.md$/, "$1");

  // import the markdown file
  const markdown = markdownFiles(path).default;

  // return an object with filename and markdown
  return { date, markdown };
});


const NewsPage = () => (
  <>
    <div className="content has-text-centered">
      <Bulma.Title className="title is-3">News</Bulma.Title>
    </div>
    <div className="content">
      {news.reverse().map((item) => (
        <>
          <NewsItem date={item.date} News={item.markdown} />
          <div className="separator" />
        </>
      ))}
    </div>
    <GoTop />
  </>
);

export default NewsPage;
