// import fs from 'fs';
// import path from 'path';

import Bulma from '../../components/Bulma';
import GoTop from '../../components/GoTop';
import NewsItem from '../../components/NewsItem';
// import { newsToLdJSON } from '~/helpers/schemaDotOrg';
import { getMetadata } from '~/helpers/metadata';

const markdownFiles = import.meta.glob('../../markdown/news/*.md', { eager: true });
const news = Object.entries(markdownFiles).map(([path, module]: [string, any]) => {
  const filename = path.replace(/^.*[/\\]/, '');
  const date = filename.replace(/^News-(.*)\.md$/, '$1');
  return { date, markdown: module.default };
});

// // Function to read markdown files directly from filesystem
// const readMarkdownFiles = () => {
//   const newsDir = path.join(__dirname, '../../markdown/news');
//   const files = fs.readdirSync(newsDir).filter(file => file.endsWith('.md'));

//   const newsItems = files.map(filename => {
//     const filePath = path.join(newsDir, filename);
//     const content = fs.readFileSync(filePath, 'utf8');
//     const date = filename.replace(/^News-(.*)\.md$/, '$1');
//     return { date, markdown: content };
//   });

//   return newsItems.sort((a, b) => b.date.localeCompare(a.date));
// };

// const newsMd = typeof window === 'undefined'
//   ? readMarkdownFiles()
//   : [];

news.sort((a, b) => {
  return b.date.localeCompare(a.date);
});

export function meta() {
  // const newsDir = path.join(__dirname, '../../markdown/news');
  // const files = fs.readdirSync(newsDir).filter(file => file.endsWith('.md'));

  // const newsItems = files.map(filename => {
  //   const filePath = path.join(newsDir, filename);
  //   const content = fs.readFileSync(filePath, 'utf8');
  //   const date = filename.replace(/^News-(.*)\.md$/, '$1');
  //   return { date, markdown: content };
  // });

  // newsItems.sort((a, b) => b.date.localeCompare(a.date));
  // console.log('newsItems', newsMd);

  return getMetadata({
    title: 'Bgee news',
    description: 'Bgee news describing each new releases',
    keywords: 'News, latest, information, releases',
    // schemaorg: [
    //   newsToLdJSON({news, path: '/about/news'}),
    // ]
  });
}

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
