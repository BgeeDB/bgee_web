import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Layout from '../components/Layout';
import ROUTES from './routes';
import PATHS from './paths';
import Page from '../components/Page';
import { ModalProvider } from '../contexts/ModalContext';
import { NotificationProvider } from '../contexts/NotificationsContext';
import StaticPage from '../pages/StaticPage';
import ScrollTop from '../components/ScrollTop';
import MarkdownReader from '../pages/MarkdownReader';
import GenericHelmetProvider from '../helpers/GenericHelmetProvider';
import Error from '../pages/Error';

const Router = () => (
  <BrowserRouter>
    <ScrollTop>
      <ModalProvider>
        <NotificationProvider>
          <Layout>
            <GenericHelmetProvider />
            <Switch>
              <Route
                exact
                path={PATHS.HOME}
                render={(props) => (
                  <Page {...props} Component={ROUTES[PATHS.HOME].component} />
                )}
              />

              <Route
                exact
                path={[
                  PATHS.ANALYSIS.TOP_ANAT,
                  PATHS.ANALYSIS.TOP_ANAT_RESULT,
                  PATHS.ANALYSIS.TOP_ANAT_RESULT_JOB_ID,
                ]}
                render={(props) => (
                  <Page
                    {...props}
                    title={ROUTES[PATHS.ANALYSIS.TOP_ANAT].name}
                    Component={ROUTES[PATHS.ANALYSIS.TOP_ANAT].component}
                  />
                )}
              />
              <Route
                exact
                path={PATHS.ANALYSIS.TOP_ANAT_RESULT}
                render={(props) => (
                  <Page
                    {...props}
                    Component={ROUTES[PATHS.ANALYSIS.TOP_ANAT_RESULT].component}
                  />
                )}
              />
              <Route
                exact
                path={[
                  PATHS.ANALYSIS.EXPRESSION_COMPARISON,
                ]}
                render={(props) => (
                  <Page
                    {...props}
                    Component={
                      ROUTES[PATHS.ANALYSIS.EXPRESSION_COMPARISON].component
                    }
                  />
                )}
              />

              <Route
                exact
                path={PATHS.SEARCH.GENE}
                render={(props) => (
                  <Page
                    {...props}
                    Component={ROUTES[PATHS.SEARCH.GENE].component}
                  />
                )}
              />
              <Route
                exact
                path={[
                  PATHS.SEARCH.GENE_ITEM,
                  PATHS.SEARCH.GENE_ITEM_BY_SPECIES,
                ]}
                render={(props) => (
                  <Page
                    {...props}
                    Component={ROUTES[PATHS.SEARCH.GENE_ITEM].component}
                  />
                )}
              />
              <Route
                exact
                path={PATHS.SEARCH.ANATOMICAL_HOMOLOGY}
                render={(props) => (
                  <Page
                    {...props}
                    Component={
                      ROUTES[PATHS.SEARCH.ANATOMICAL_HOMOLOGY].component
                    }
                  />
                )}
              />
              <Route
                exact
                path={PATHS.SEARCH.SPECIES}
                render={(props) => (
                  <Page
                    {...props}
                    Component={ROUTES[PATHS.SEARCH.SPECIES].component}
                  />
                )}
              />
              <Route
                exact
                path={PATHS.SEARCH.SPECIES_ITEM}
                render={(props) => (
                  <Page
                    {...props}
                    Component={ROUTES[PATHS.SEARCH.SPECIES_ITEM].component}
                  />
                )}
              />
              <Route
                exact
                path={[
                    PATHS.SEARCH.GENE_LIST_ITEM,
                    PATHS.SEARCH.GENE_LIST_ITEM_BY_SPECIES]}
                render={(props) => (
                  <Page
                    {...props}
                    Component={ROUTES[PATHS.SEARCH.GENE_LIST_ITEM_BY_SPECIES].component}
                  />
                )}
              />
              <Route
                exact
                path={PATHS.SEARCH.RAW_DATA_ANNOTATIONS}
                render={(props) => (
                  <Page
                    {...props}
                    Component={
                      ROUTES[PATHS.SEARCH.RAW_DATA_ANNOTATIONS].component
                    }
                  />
                )}
              />
              <Route
                exact
                path={PATHS.SEARCH.EXPRESSION_MATRIX}
                render={(props) => (
                  <Page
                    {...props}
                    Component={
                      ROUTES[PATHS.SEARCH.EXPRESSION_MATRIX].component
                    }
                  />
                )}
              />
              <Route
                exact
                path={PATHS.SEARCH.EXPRESSION_CALLS}
                render={(props) => (
                  <Page
                    {...props}
                    Component={ROUTES[PATHS.SEARCH.EXPRESSION_CALLS].component}
                  />
                )}
              />
              <Route
                exact
                path={PATHS.SEARCH.EXPERIMENT}
                render={(props) => (
                  <Page
                    {...props}
                    Component={ROUTES[PATHS.SEARCH.EXPERIMENT].component}
                  />
                )}
              />

              <Route
                exact
                path={PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS}
                render={(props) => (
                  <Page
                    {...props}
                    Component={
                      ROUTES[PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS].component
                    }
                  />
                )}
              />
              <Route
                exact
                path={PATHS.DOWNLOAD.PROCESSED_EXPRESSION_VALUES}
                render={(props) => (
                  <Page
                    {...props}
                    Component={
                      ROUTES[PATHS.DOWNLOAD.PROCESSED_EXPRESSION_VALUES]
                        .component
                    }
                  />
                )}
              />
              <Route
                exact
                path={PATHS.DOWNLOAD.DATA_DUMPS}
                render={(props) => (
                  <Page
                    {...props}
                    Component={ROUTES[PATHS.DOWNLOAD.DATA_DUMPS].component}
                  />
                )}
              />

              <Route
                exact
                path={PATHS.ABOUT.NEWS}
                render={(props) => (
                  <Page
                    {...props}
                    Component={ROUTES[PATHS.ABOUT.NEWS].component}
                  />
                )}
              />
              <Route
                exact
                path={PATHS.ABOUT.SOURCES}
                render={(props) => (
                  <Page
                    {...props}
                    Component={ROUTES[PATHS.ABOUT.SOURCES].component}
                  />
                )}
              />

              <Route
                exact
                path={[
                  PATHS.RESOURCES.R_PACKAGES,
                  PATHS.RESOURCES.ANNOTATIONS,
                  PATHS.RESOURCES.ONTOLOGIES,
                  PATHS.RESOURCES.SOURCE_CODE,
                  PATHS.SUPPORT.TUTORIALS,
                  PATHS.SUPPORT.VIDEOS,
                  PATHS.ABOUT.ABOUT,
                  PATHS.ABOUT.COLLABORATIONS,
                  PATHS.ABOUT.PUBLICATION,
                  PATHS.ABOUT.TEAM,
                  PATHS.ABOUT.BGEESAB,
                  PATHS.ABOUT.PRIVACY_POLICY,
                ]}
                render={(props) => <Page {...props} Component={StaticPage} />}
              />
              <Route
                exact
                path={[
                  PATHS.SUPPORT.GTEX,
                  PATHS.SUPPORT.SCRNASEQPROTOCOLS,
                  PATHS.SUPPORT.TUTORIAL_GENE_PAGE,
                  PATHS.SUPPORT.TUTORIAL_TOPANAT,
                  PATHS.SUPPORT.TUTORIAL_EXPRESSION_CALLS,
                  PATHS.SUPPORT.TUTORIAL_SPARQL,
                  PATHS.SUPPORT.TUTORIAL_CURATION,
                  PATHS.SUPPORT.TUTORIAL_EXPRESSION_COMPARISON,
                  PATHS.SUPPORT.TUTORIAL_RAW_DATA,
                  PATHS.SUPPORT.TUTORIAL_ANAT_HOMOLOGY,
                  PATHS.SUPPORT.TUTORIAL_AFFY_EXPR_VAL,
                  PATHS.SUPPORT.TUTORIAL_RNASEQ_EXPR_VAL,
                  PATHS.SUPPORT.TUTORIAL_SCRNASEQ_FL_EXPR_VAL,
                  PATHS.SUPPORT.TUTORIAL_SCRNASEQ_TB_EXPR_VAL,
                  PATHS.SUPPORT.TUTORIAL_EXPR_VAL,
                  PATHS.SUPPORT.TUTORIAL_GENE_EXPR,
                  PATHS.SUPPORT.FAQ,
                ]}
                render={(props) => (
                  <Page {...props} Component={MarkdownReader} />
                )}
              />

              <Route path={PATHS.ERROR} component={Error} />

              <Redirect to={{ pathname: PATHS.ERROR, state: { error: { message: 404} } }} />
            </Switch>
          </Layout>
        </NotificationProvider>
      </ModalProvider>
    </ScrollTop>
  </BrowserRouter>
);

export default Router;
