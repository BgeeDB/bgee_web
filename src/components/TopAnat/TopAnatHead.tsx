import { Link } from 'react-router';
import { Newspaper, Bookmark } from 'lucide-react';

import TopAnatHistoryModal from './TopAnatHistoryModal';
import PATHS from '../../paths/paths';
import Tooltip from '../Tooltip';

const EXAMPLES = [
  {
    id: '4f12796d5c1f1c478cb3bf91f38355d4ee94c835',
    description:
      'Autism spectrum associated genes from Satterstrom et al. 2020 https://doi.org/10.1016/j.cell.2019.12.036',
  },
  {
    id: '106462a670fc205ef34f0babec787bd00e7ab7ef',
    description: 'Mouse genes mapped to the GO term "spermatogenesis".',
  },
  {
    id: '22e5257f8fc28f4564f0d1c3fcdbbadc61f7cc97',
    description:
      'Zebrafish 3R ohnologs from Roux et al. 2017 https://doi.org/10.1093/molbev/msx199 showing nervous system expression of 3R duplicates.',
  },
  {
    id: 'a4cdd03c7a4ebb43ec08609552697661cc49cbc9',
    description: 'Pigmentation genes in rabbit.',
  },
  {
    id: '1aa3801c5c3838428bf5433a5b1542b10228c6e7',
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
      .
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
