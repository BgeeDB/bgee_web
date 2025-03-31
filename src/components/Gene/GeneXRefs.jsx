/* eslint-disable no-nested-ternary,jsx-a11y/label-has-associated-control,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions, no-case-declarations, react/no-array-index-key */
import Bulma from '../Bulma';
import LinkExternal from '../LinkExternal';
import GeneExpandableList from './GeneExpandableList';
import GENE_DETAILS_HTML_IDS from '../../helpers/constants/GeneDetailsHtmlIds';

const GeneXRefs = ({ isLoading, data }) => (
  <div id={GENE_DETAILS_HTML_IDS.XREFS}>
    <Bulma.Title size={4} className="gradient-underline" renderAs="h2">
      Cross-references
    </Bulma.Title>
    <div>
      {isLoading ? (
        <progress
          className="progress is-small"
          max="100"
          style={{ animationDuration: '4s' }}
        >
          80%
        </progress>
      ) : (
        data?.gene?.xRefs.map((xref) => (
          <Bulma.Columns key={xref.source.name} className="my-0">
            <Bulma.C size={3}>
              <p className="has-text-weight-semibold">{xref.source.name}</p>
            </Bulma.C>
            <Bulma.C size={9}>
              <GeneExpandableList
                items={xref.xRefs}
                renderElement={(ref, key, elements) => (
                  <span key={ref.xRefId}>
                    <LinkExternal to={ref.xRefURL.replace('ensembl.org/Heterocephalus_glaber/', 'ensembl.org/Heterocephalus_glaber_female/')}>{ref.xRefId}</LinkExternal>
                    {ref.xRefName && <>{` (${ref.xRefName})`}</>}
                    {key !== elements.length - 1 ? (
                      <span className="mr-1">,</span>
                    ) : (
                      ''
                    )}
                  </span>
                )}
              />
            </Bulma.C>
          </Bulma.Columns>
        ))
      )}
    </div>
  </div>
);
export default GeneXRefs;
