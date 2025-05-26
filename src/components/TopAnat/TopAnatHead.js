import { Link } from 'react-router-dom';
import TopAnatHistoryModal from './TopAnatHistoryModal';
import PATHS from '../../routes/paths';
import Bulma from '../Bulma';
import Tooltip from '../Tooltip';

const EXAMPLES = [
  {
    id: '8af5b0727ba1c62318707bf6f59c7c9c2b3697a1',
    description:
      'Autism spectrum associated genes from Satterstrom et al. 2020 https://doi.org/10.1016/j.cell.2019.12.036',
  },
  {
    id: '2dd226ea83f1b041cf105e7d18a01d81fff19d10',
    description: 'Mouse genes mapped to the GO term "spermatogenesis".',
  },
  {
    id: '2bf58d4561f36bbaec9bebc730131423e695df3d',
    description:
      'Zebrafish 3R ohnologs from Roux et al. 2017 https://doi.org/10.1093/molbev/msx199 showing nervous system expression of 3R duplicates.',
  },
  {
    id: '9a9896727557dab83c45731d3fd4f4ccadf19be0',
    description: 'Pigmentation genes in rabbit.',
  },
  {
    id: '10fb20cc0f767484a570ee82e5c24fc317657d23',
    description: 'COVID-19 related human genes.',
  },
];

const TopAnatHead = () => (
  <>
    <div className="content has-text-centered">
      <h1 className="title is-3">TopAnat - Gene Expression Enrichment</h1>
    </div>
    <p className="is-size-5">
      GO-like enrichment of anatomical terms, mapped to genes by expression
      patterns. It is possible to run TopAnat using our{' '}
      <a
        href="https://bioconductor.org/packages/BgeeDB/"
        target="_blank"
        rel="noopener noreferrer"
        className="external-link"
      >
        BgeeDB R package
      </a>
      . This is the same as this web-service, but with more flexibility in the
      choice of parameters and developmental stages, and is based on the{' '}
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
      <Link
        to={PATHS.SUPPORT.TUTORIAL_TOPANAT}
        className="button is-bgee-link is-outlined mr-2"
      >
        <Bulma.IonIcon name="newspaper-outline" />
        <span>Documentation</span>
      </Link>
      <div className="is-align-items-center is-flex">
        <span className="icon-text">
          <Bulma.IonIcon name="bookmarks-sharp" />
          <span>Examples</span>
        </span>
        <div className="ml-1 buttons">
          {EXAMPLES.map((ex, key) => (
            <Tooltip
              key={ex.id}
              title={`Example ${key + 1}`}
              content={ex.description}
            >
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
