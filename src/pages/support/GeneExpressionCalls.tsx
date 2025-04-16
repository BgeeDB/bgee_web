import { Link } from 'react-router';
import useAnchorAtMount from '../../hooks/useAnchorAtMount';
import PATHS from '../../paths/paths';
import GoTop from '../../components/GoTop';
import { getMetadata } from '~/helpers/metadata';

export function meta() {
  return getMetadata({
    title: 'Gene expression calls documentation',
    description: 'Documentation about the TSV download files containing present/absent gene expression calls.',
    keywords: 'dataset, data download, gene expression calls, present/absent expression calls',
  });
}

const GeneExpressionCalls = () => {
  useAnchorAtMount();

  return (
    <>
      <div className="content has-text-centered">
        <p className="title is-5">Expression call download file documentation</p>
      </div>
      <p>
        Bgee provides calls of baseline presence/absence of expression, and of differential over-/under-expression,
        either for single species, or compared between species (orthologous genes in homologous organs). This
        documentation describes the format of these{' '}
        <Link to={PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS} title="Bgee expression data page">
          download files
        </Link>
        .
      </p>
      <GoTop />
    </>
  );
};

export default GeneExpressionCalls;
