import React from 'react';
import {Link} from "react-router-dom";
import ROUTES from "../../routes/routes";
import PATHS from "../../routes/paths";
import config from "../../config.json";

import obfuscateMailLink from '../../helpers/obfuscateMailLink';
import Bulma from "../Bulma";
import assets from "../../assets";

const APP_VERSION = config.version;
const URL_VERSION = APP_VERSION.replaceAll('.', '-');
const URL_ROOT = `${config.archive ? `${URL_VERSION}` : ''}`;

const SIDE_MENU = [
    {
        key: 'menu.tools.test',
        title: 'Tools',
        children: [
            {
                key: 'page.tools.top-anat.test',
                title: ROUTES[PATHS.ANALYSIS.TOP_ANAT].title,
                type: 'internal',
                path: PATHS.ANALYSIS.TOP_ANAT,
            },
            {
                key: 'page.tools.expression-comparison.test',
                title: ROUTES[PATHS.ANALYSIS.EXPRESSION_COMPARISON].title,
                type: 'internal',
                path: PATHS.ANALYSIS.EXPRESSION_COMPARISON,
            },
            {
                key: 'page.tools.expression-matrix.test',
                title: ROUTES[PATHS.SEARCH.EXPRESSION_MATRIX].title,
                type: 'internal',
                path: PATHS.SEARCH.EXPRESSION_MATRIX,
            },
            {
                key: 'page.tools.anatomical-homology-search.test',
                title: ROUTES[PATHS.SEARCH.ANATOMICAL_HOMOLOGY].title,
                type: 'internal',
                path: PATHS.SEARCH.ANATOMICAL_HOMOLOGY,
            },
        ],
    },
    {
        key: 'menu.browse.test',
        title: 'Browse',
        children: [
            {
                key: 'page.browse.gene-search.test',
                title: ROUTES[PATHS.SEARCH.GENE].title,
                type: 'internal',
                path: PATHS.SEARCH.GENE,
            },
            {
                key: 'page.browse.species.test',
                title: ROUTES[PATHS.SEARCH.SPECIES].title,
                type: 'internal',
                path: PATHS.SEARCH.SPECIES,
            },
            {
                key: 'page.browse.raw-data-experiment.test',
                title: 'Experiments',
                type: 'internal',
                path: PATHS.SEARCH.RAW_DATA_ANNOTATIONS,
            },
            {
                key: 'page.browse.raw-data-annotations.test',
                title: 'Raw data annotations',
                type: 'fullinternal',
                path: `${config.genericDomain}${PATHS.SEARCH.RAW_DATA_ANNOTATIONS}?pageType=raw_data_annots`,
            },
            {
                key: 'page.browse.raw-data-processed-expression-values.test',
                title: 'Processed expression values',
                type: 'fullinternal',
                path: `${config.genericDomain}${PATHS.SEARCH.RAW_DATA_ANNOTATIONS}?pageType=proc_expr_values`,
            },
            {
                key: 'page.browse.presence-absence-expression-calls.test',
                title: ROUTES[PATHS.SEARCH.EXPRESSION_CALLS].title,
                type: 'internal',
                path: PATHS.SEARCH.EXPRESSION_CALLS,
            },
        ],
    },
    {
        key: 'menu.download.test',
        title: 'Download',
        children: [
            {
                key: 'page.download.gene-expression-calls.test',
                title: ROUTES[PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS].title,
                type: 'internal',
                path: PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS,
            },
            {
                key: 'page.download.processed-expression-values.test',
                title: ROUTES[PATHS.DOWNLOAD.PROCESSED_EXPRESSION_VALUES].title,
                type: 'internal',
                path: PATHS.DOWNLOAD.PROCESSED_EXPRESSION_VALUES,
            },
            {
                key: 'page.download.data-dumps.test',
                title: ROUTES[PATHS.DOWNLOAD.DATA_DUMPS].title,
                type: 'internal',
                path: PATHS.DOWNLOAD.DATA_DUMPS,
            },
        ],
    },
    {
        key: 'menu.resources.test',
        title: 'Resources',
        children: [
            {
                key: 'page.resources.r-packages.test',
                title: ROUTES[PATHS.RESOURCES.R_PACKAGES].title,
                type: 'internal',
                path: PATHS.RESOURCES.R_PACKAGES,
            },
            {
                key: 'page.resources.sparql.test',
                title: 'SPARQL endpoint',
                path: `/sparql${URL_ROOT}/`,
                type: 'external',
            },
        ],
    },
    {
        key: 'menu.help.test',
        title: 'Help and info',
        children: [
            {
                key: 'page.help.annotations.test',
                title: ROUTES[PATHS.RESOURCES.ANNOTATIONS].title,
                type: 'internal',
                path: PATHS.RESOURCES.ANNOTATIONS,
            },
            {
                key: 'page.help.ontologies.test',
                title: ROUTES[PATHS.RESOURCES.ONTOLOGIES].title,
                type: 'internal',
                path: PATHS.RESOURCES.ONTOLOGIES,
            },
            {
                key: 'page.help.source-code.test',
                title: ROUTES[PATHS.RESOURCES.SOURCE_CODE].title,
                type: 'internal',
                path: PATHS.RESOURCES.SOURCE_CODE,
            },
            {
                key: 'page.help.support.tutorials.test',
                title: ROUTES[PATHS.SUPPORT.TUTORIALS].title,
                type: 'internal',
                path: PATHS.SUPPORT.TUTORIALS,
            },
            {
                key: 'page.help.support.gtex.test',
                title: ROUTES[PATHS.SUPPORT.GTEX].title,
                type: 'internal',
                path: PATHS.SUPPORT.GTEX,
            },
            {
                key: 'page.help.support.scrna-seq-protocols-comparison.test',
                title: ROUTES[PATHS.SUPPORT.SCRNASEQPROTOCOLS].title,
                type: 'internal',
                path: PATHS.SUPPORT.SCRNASEQPROTOCOLS,
            },
            {
                key: 'page.help.support.videos.test',
                title: ROUTES[PATHS.SUPPORT.VIDEOS].title,
                type: 'internal',
                path: PATHS.SUPPORT.VIDEOS,
            },
            {
                key: 'page.help.support.faq.test',
                title: ROUTES[PATHS.SUPPORT.FAQ].title,
                type: 'internal',
                path: PATHS.SUPPORT.FAQ,
            },
            {
                key: 'page.help.support.contact-us.test',
                title: 'Contact us',
                type: 'mail',
                mail: config.contactEmail,
            },
            {
                key: 'page.help.about.about.test',
                title: ROUTES[PATHS.ABOUT.ABOUT].title,
                type: 'internal',
                path: PATHS.ABOUT.ABOUT,
            },
            {
                key: 'page.help.about.news.test',
                title: ROUTES[PATHS.ABOUT.NEWS].title,
                type: 'internal',
                path: PATHS.ABOUT.NEWS,
            },
            {
                key: 'page.help.about.collaborations.test',
                title: ROUTES[PATHS.ABOUT.COLLABORATIONS].title,
                type: 'internal',
                path: PATHS.ABOUT.COLLABORATIONS,
            },
            {
                key: 'page.help.about.publications.test',
                title: ROUTES[PATHS.ABOUT.PUBLICATION].title,
                type: 'internal',
                path: PATHS.ABOUT.PUBLICATION,
            },
            {
                key: 'page.help.about.sources.test',
                title: ROUTES[PATHS.ABOUT.SOURCES].title,
                type: 'internal',
                path: PATHS.ABOUT.SOURCES,
            },
            {
                key: 'page.help.about.team.test',
                title: ROUTES[PATHS.ABOUT.TEAM].title,
                type: 'internal',
                path: PATHS.ABOUT.TEAM,
            },
            {
                key: 'page.help.about.bgeesab.test',
                title: ROUTES[PATHS.ABOUT.BGEESAB].title,
                type: 'internal',
                path: PATHS.ABOUT.BGEESAB,
            },
            {
                key: 'page.help.about.privacy-policy.test',
                title: ROUTES[PATHS.ABOUT.PRIVACY_POLICY].title,
                type: 'internal',
                path: PATHS.ABOUT.PRIVACY_POLICY,
            },
        ],
    },
]

const MenuModal = () => {
    const [active, setActive] = React.useState(false);

    const toggle = () => {
        setActive(!active);
    }

    return (
        <>
            <button type="button" aria-haspopup="true" aria-controls="bgee-complete-menu" aria-expanded="false"
                    className="navbar-item custom navbar-item-button"
                    onClick={toggle}>
                <div className="custom-burger">
                    <span aria-hidden="true"/>
                    <span aria-hidden="true"/>
                    <span aria-hidden="true"/>
                </div>
                <span className="custom-burger-text">All</span>
            </button>
            <ModalCard
                active={active}
                toggle={toggle}/>
        </>
    );
}

const ModalCard = ({active, toggle}) => (
    <div id="bgee-complete-menu" className={`modal menu-modal ${active ? 'is-active' : ''}`}>
        <div className="modal-background" onClick={toggle} aria-hidden="true"/>
        <div className="modal-card menu-modal-card ">
            <Link
                className="menu-modal-brand "
                to={PATHS.HOME}
                onClick={(event) => {
                    event.target.blur();
                    toggle();
                }}>
                <Bulma.Image
                    alt="Bgee logo"
                    className="logo"
                    src={assets.bgeeLogo}
                    height={40}
                    width={99}
                />
            </Link>

            <aside className="menu">
                {SIDE_MENU.map(({ key, children, title }) => (
                    <div key={key}>
                        <p className="menu-label my-3">{title}</p>
                        <ul className="menu-list">
                            {children.map(
                                ({ key: keyChild, type, title: pageTitle, ...childProps }) => {
                                    let link;
                                    switch (type) {
                                        case 'mail':
                                            link = (
                                                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
                                                <a
                                                    className="navbar-item custom"
                                                    onClick={obfuscateMailLink(childProps.mail)}
                                                >
                                                    {pageTitle}
                                                </a>
                                            );
                                            break;
                                        case 'external':
                                            link = (
                                                <a
                                                    className="navbar-item custom"
                                                    href={childProps.path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {pageTitle}
                                                </a>
                                            );
                                            break;
                                        case 'fullinternal':
                                            link = (
                                                <a
                                                    className="navbar-item custom"
                                                    href={childProps.path}
                                                >
                                                    {pageTitle}
                                                </a>
                                            );
                                            break;
                                        case 'internal':
                                        default:
                                            link = (
                                                <Link
                                                    to={childProps.path}
                                                    className="navbar-item custom"
                                                    onClick={(event) => {
                                                        event.target.blur();
                                                        toggle();
                                                    }}
                                                >
                                                    {pageTitle}
                                                </Link>
                                            );
                                    }
                                    return <li key={keyChild}>{link}</li>;
                                }
                            )}
                        </ul>
                    </div>
                ))}
            </aside>
        </div>
    </div>
);

export default MenuModal;
