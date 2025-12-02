import imagePath from '../../helpers/imagePath';
import { getMetadata } from '~/helpers/metadata';
import staticBuilder from '~/helpers/staticBuilder';

export function meta() {
  return getMetadata({
    title: 'R packages and containers available',
    description: 'Access R packages allowing to retrieve Bgee data, or to perform Bgee analyses on your own data.',
    keywords: 'R package, Bioconductor, BgeeDB, BgeeCall, Docker container',
  });
}

export default function Page() {
  return staticBuilder(rPackage);
}

const rPackage = [
  {
    type: 'title',
    content: 'R packages',
  },
  {
    type: 'grid',
    content: [
      {
        children: [
          {
            type: 'card',
            title: 'BgeeDB R package',
            image: {
              src: imagePath('/logo/r-logo-color.webp'),
              alt: 'R logo',
            },
            link: 'https://bioconductor.org/packages/BgeeDB/',
            linkType: 'external',
            classNames: 'mb-3',
          },
          {
            type: 'text',
            classNames: 'has-text-centered',
            content:
              'Retrieve annotations, quantitative data and expression calls produced by the Bgee pipeline. Run GO-like enrichment analyses based on anatomical terms, where genes are mapped to anatomical terms by expression patterns.',
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'BgeeCall R package',
            image: {
              src: imagePath('/logo/r-logo-color.webp'),
              alt: 'R logo',
            },
            link: 'https://bioconductor.org/packages/BgeeCall/',
            linkType: 'external',
            classNames: 'mb-3',
          },
          {
            type: 'text',
            classNames: 'has-text-centered',
            content:
              'Generate present/absent gene expression calls for your own RNA-Seq libraries as long as the species are present in Bgee. BgeeCall uses reference intergenic regions to define a threshold of presence of expression specific to your RNA-Seq library.',
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'Container for BgeeCall and BgeeDB',
            image: {
              src: imagePath('/logo/docker-logo.webp'),
              alt: 'Docker logo',
            },
            link: 'https://hub.docker.com/r/bgeedb/bgee_r',
            linkType: 'external',
            classNames: 'mb-3',
          },
          {
            type: 'text',
            classNames: 'has-text-centered',
            content:
              'Docker container for BgeeCall and BgeeDB R Bioconductor packages. Contains everything needed to download Bgee data, run TopAnat or generate present/absent calls in R.',
          },
        ],
      },
    ],
    cols: 4,
  },
];
