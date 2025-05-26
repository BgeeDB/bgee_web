import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import useAnchorAtMount from '../../hooks/useAnchorAtMount';
import PATHS from '../../routes/paths';
import GoTop from '../../components/GoTop';

const GeneExpressionCalls = () => {
  useAnchorAtMount();

  return (
    <>
      <Helmet>
        <title>Gene expression calls documentation</title>
        <meta property='og:title' content='Gene expression calls documentation' />
        <meta name="description" content="Documentation about the TSV download files containing present/absent gene expression calls." />
        <meta property='og:description' content='Documentation about the TSV download files containing present/absent gene expression calls.' />
        <meta name="keywords" content="dataset, data download, gene expression calls, present/absent expression calls" />
      </Helmet>
      <div className="content has-text-centered">
        <p className="title is-5">
          Expression call download file documentation
        </p>
      </div>
      <p>
        Bgee provides calls of baseline presence/absence of expression, and of
        differential over-/under-expression, either for single species, or
        compared between species (orthologous genes in homologous organs). This
        documentation describes the format of these{' '}
        <Link
          to={PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS}
          title="Bgee expression data page"
        >
          download files
        </Link>
        .
      </p>
      <GoTop />
    </>
  );
};

export default GeneExpressionCalls;
