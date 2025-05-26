/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import {Link, useHistory, useParams} from "react-router-dom";
import { Helmet } from 'react-helmet';
import Bulma from '../../components/Bulma';
import api from '../../api';
import PATHS from "../../routes/paths";
import config from '../../config.json';

const SpeciesGeneList = () => {
    let speciesDisplay = '';
    let speciesScientificName = '';
    let canonicalURL = '';

    const [genes, setGenes] = useState([]);
    const [species, setSpecies] = useState([]);
    const [loading, setLoading] = useState(false);
    const { speciesId, speciesName } = useParams();
    const history = useHistory();

    function getCanonicalURL(sp) {
        return PATHS.SEARCH.GENE_LIST_ITEM_BY_SPECIES
            .replace(':speciesId', sp.id)
            .replace(':speciesName', sp.speciesFullNameWithoutSpace?.replace("_", "-").toLowerCase()); 
    }

    React.useEffect(() => {
        setLoading(true);

        // Make the geneList API call first
        api.search.species.geneList(speciesId)
            .then((geneListResp) => setGenes(geneListResp.data.genes))
            .finally(() => setLoading(false));
    }, [speciesId]);
    
    React.useEffect(() => {
        api.search.species.name(speciesId)
            .then((nameResp) => {
                setSpecies(nameResp.data.species);
                if (nameResp.data.species.speciesFullNameWithoutSpace !== speciesName) {
                    history.replace(getCanonicalURL(nameResp.data.species));
                }
            })
            .catch((err) => {
                console.log(err.message);
                history.replace(PATHS.ERROR, {
                    error: {
                        message: err.message || err?.data?.code,
                    },
                });
            });
    }, [speciesId]);

    if (species) {
        speciesScientificName = `${species.genus} ${species.speciesName}`;
        speciesDisplay = `${speciesScientificName}${species.name ? ` (${species.name})` : ''}`;
        canonicalURL = `${config.genericDomain}${getCanonicalURL(species)}`;
    }

    const meta = React.useMemo(
        () => ({
            title: `${speciesDisplay} gene list`,
            description: `List of genes of ${speciesScientificName} with expression data available in Bgee`,
            keywords: `${speciesScientificName} genes, gene expression in ${speciesScientificName}`,
        }),
        [speciesScientificName, speciesDisplay]
    );

    function getGeneDisplay(element) {
        let text = element.geneId;
        if (element.name) {
            text = `${element.name} (${text})`;
        }
        return text;
    }

    return !species ? null :(
        <>
            <Helmet>
                <title>{meta.title} gene list</title>
                <meta property='og:title' content={`${meta.title} gene list`} />
                <meta name="description" content={meta.description}/>
                <meta property='og:description' content={meta.description} />
                <meta name="keywords" content={meta.keywords}/>
                <meta property="og:url" content={canonicalURL}/>
                <link rel="canonical" href={canonicalURL}/>
            </Helmet>

            <div className="content has-text-centered">
                <Bulma.Title size={3} className="m-0">{`Gene list for ${speciesDisplay}`}
                </Bulma.Title>
            </div>
            
            {loading && (
                <Bulma.Notification color="info" className="mt-5">
                    <p className="has-text-centered">Loading</p>
                    <progress
                        className="progress is-small"
                        max="100"
                        style={{ animationDuration: '3s', marginBottom: 12 }}
                    >
                        80%
                    </progress>
                </Bulma.Notification>
            )}
            
            {!loading && genes && (
                <div className="content">
                    <div className="content">
                        <ul className="inline-list">
                            {genes.map((element, index) =>
                                <li key={element.geneId}>
                                    <Link className="internal-link"
                                          to={PATHS.SEARCH.GENE_ITEM_BY_SPECIES
                                              .replace(':geneId', element.geneId)
                                              .replace(':speciesId', element.geneMappedToSameGeneIdCount === 1 ? '' : species?.id)
                                              .replace(/\/$/, '')}
                                          title={`Gene expression for ${element.name} in ${speciesDisplay}`}>
                                        {getGeneDisplay(element)}
                                    </Link>
                                    {index < genes.length - 1 && <span className="inline-list-separator"/>}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default SpeciesGeneList;
