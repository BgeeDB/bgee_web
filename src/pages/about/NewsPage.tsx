import Bulma from '../../components/Bulma';
import GoTop from '../../components/GoTop';
import NewsItem from '../../components/NewsItem';
import { getMetadata } from '~/helpers/metadata';

export function meta() {
  return getMetadata({
    title: 'Bgee news',
    description: 'Bgee news describing each new releases',
    keywords: 'News, latest, information, releases',
  });
}

const markdownFiles = import.meta.glob('../../markdown/news/*.md', { eager: true });
const news = Object.entries(markdownFiles).map(([path, module]: any) => {
  const filename = path.replace(/^.*[/\\]/, '');
  const date = filename.replace(/^News-(.*)\.md$/, '$1');
  return { date, markdown: module.default };
});

news.sort((a, b) => {
  return b.date.localeCompare(a.date);
});

const NewsPage = () => (
  <>
    <div className="content has-text-centered">
      <Bulma.Title className="title is-3">News</Bulma.Title>
    </div>
    <div className="content">
      {news.map((item) => (
        <div key={item.date}>
          <NewsItem date={item.date} News={item.markdown} />
          <div className="separator" />
        </div>
      ))}
    </div>
    <GoTop />
  </>
);

export default NewsPage;
