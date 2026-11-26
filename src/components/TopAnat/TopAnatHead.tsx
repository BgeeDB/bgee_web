import { Link } from 'react-router';
import { Newspaper, Bookmark } from 'lucide-react';

import TopAnatHistoryModal from './TopAnatHistoryModal';
import PATHS from '../../paths/paths';
import Tooltip from '../Tooltip';

const EXAMPLES = [
  {
    id: 'ef1163ede3add9c2d3bf19662cf481d16ea99580',
    description:
      'Autism spectrum associated genes from Satterstrom et al. 2020 https://doi.org/10.1016/j.cell.2019.12.036',
  },
  {
    id: '2eadc1675a9ae1462b6b856e4aa3433cd5960460',
    description: 'Mouse genes mapped to the GO term "spermatogenesis".',
  },
  {
    id: '68fda7fdb09be21163a2f3eadae2a64c5ef19265',
    description:
      'Zebrafish 3R ohnologs from Roux et al. 2017 https://doi.org/10.1093/molbev/msx199 showing nervous system expression of 3R duplicates.',
  },
  {
    id: '39a82a05356d0222d264d5c1c76e0099054518bc',
    description: 'Pigmentation genes in rabbit.',
  },
  {
    id: 'bb425845e8d54e5d3d431c7ab9b9540bdec52f44',
    description: 'COVID-19 related human genes.',
  },
];

const TopAnatHead = () => (
  <>
    <div className="content has-text-centered">
      <h1 className="title is-3">TopAnat - Gene Expression Enrichment</h1>
    </div>
    <p className="is-size-5">
      GO-like enrichment of anatomical terms, mapped to genes by expression patterns. It is possible to run TopAnat
      using our{' '}
      <a
        href="https://bioconductor.org/packages/BgeeDB/"
        target="_blank"
        rel="noopener noreferrer"
        className="external-link"
      >
        BgeeDB R package
      </a>
      . This is the same as this web-service, but with more flexibility in the choice of parameters and developmental
      stages, and is based on the{' '}
      <a
        href="https://bioconductor.org/packages/topGO/"
        target="_blank"
        rel="noopener noreferrer"
        className="external-link"
      >
        topGO package
      </a>
      . This web-service runs its analyses without decorrelation, the decorrelation methods being available from the
      BgeeDB R package. Opening the link of an analysis run with decorrelation in Bgee 15.2 or an earlier release runs
      it again without decorrelation; its original results remain available from the archive site of that release.
    </p>
    <div id="helpers-top-anat" className="my-4 is-flex">
      <TopAnatHistoryModal />
      <Link to={PATHS.SUPPORT.TUTORIAL_TOPANAT} className="button is-bgee-link is-outlined mr-2">
        <Newspaper size={15} className="mr-1" />
        <span>Documentation</span>
      </Link>
      <div className="is-align-items-center is-flex">
        <span className="icon-text is-flex is-align-items-center mr-1">
          <Bookmark size={15} className="mr-1" />
          <span>Examples</span>
        </span>
        <div className="ml-1 buttons">
          {EXAMPLES.map((ex, key) => (
            <Tooltip key={ex.id} title={`Example ${key + 1}`} content={ex.description} className="mr-1">
              <Link
                to={PATHS.ANALYSIS.TOP_ANAT_RESULT.replace(':id', ex.id)}
                className="button is-bgee-link is-outlined m-0"
              >
                <span>{key + 1}</span>
              </Link>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default TopAnatHead;
