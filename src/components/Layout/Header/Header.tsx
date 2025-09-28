import React from 'react';
import { Link } from 'react-router';

import assets from '../../../assets';
import PATHS from '../../../paths/paths';
import Bulma from '../../Bulma';
import config from '../../../config.json';
import ROUTES from '../../../paths/routes';
import MenuModal from '../../Modal/MenuModal';

const NAVBAR_LEFT = [
  {
    key: 'page.search.gene-search',
    title: 'Gene expression',
    type: 'internal',
    path: PATHS.SEARCH.GENE,
  },
  {
    key: 'page.analysis.top-anat',
    title: 'TopAnat',
    type: 'internal',
    path: PATHS.ANALYSIS.TOP_ANAT,
  },
  {
    key: 'page.analysis.expression-comparison',
    title: 'Expression comparison',
    type: 'internal',
    path: PATHS.ANALYSIS.EXPRESSION_COMPARISON,
  },
  {
    key: 'page.search.raw-data-experiment',
    title: 'Curated data',
    type: 'internal',
    path: PATHS.SEARCH.RAW_DATA_ANNOTATIONS,
  },
  {
    key: 'page.search.sparql',
    title: 'SPARQL',
    type: 'internal',
    path: PATHS.SEARCH.SPARQL,
  },
  {
    key: 'page.support.tutorials',
    title: ROUTES[PATHS.SUPPORT.TUTORIALS].title,
    type: 'internal',
    path: PATHS.SUPPORT.TUTORIALS,
  },
];

const NAVBAR_RIGHT = [
  {
    href: 'https://www.unil.ch/unil/en/home.html',
    src: assets.unilLogo,
    alt: 'UNIL',
    className: 'no-responsive',
  },
  {
    href: 'https://www.sib.swiss/',
    src: assets.sibLogo,
    alt: 'SIB',
    className: 'no-responsive',
  },
];

const Header = () => {
  const [hamburgerActive, setHamburgerActive] = React.useState(false);

  return (
    <nav className="navbar py-3 is-bgee-inverted" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="" to={PATHS.HOME}>
          <Bulma.Image alt="Bgee logo" className="logo" src={assets.bgeeLogo} height={50} />
        </Link>

        {!config?.isRawDataOnly && (
          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            onClick={() => setHamburgerActive(!hamburgerActive)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </a>
        )}
      </div>

      {!config?.isRawDataOnly && (
        <div className={`navbar-menu ${hamburgerActive ? 'is-active' : ''}`}>
          <MenuModal />
          <div className="navbar-start">
            {NAVBAR_LEFT.map(({ key, title, type, path }) => {
              switch (type) {
                case 'external':
                  return (
                    <a key={key} className="navbar-item" href={path} target="_blank" rel="noopener noreferrer">
                      {title}
                    </a>
                  );
                case 'internal':
                default:
                  return (
                    <Link
                      key={key}
                      to={path}
                      className="navbar-item"
                      onClick={(event) => {
                        (event.target as HTMLElement).blur();
                        setHamburgerActive(false);
                      }}
                    >
                      {title}
                    </Link>
                  );
              }
            })}
          </div>

          <div className="navbar-end">
            {NAVBAR_RIGHT.map(({ href, alt, ...imgProps }) => (
              <a
                key={href}
                // className="navbar-item"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Bulma.Image alt={alt} {...imgProps} className="logo-associations" />
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
