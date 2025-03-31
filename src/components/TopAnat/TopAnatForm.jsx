/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import Bulma from '../Bulma';
import InfoIcon from '../InfoIcon';
import TextArea from '../Form/TextArea';
import HelpIcon from '../HelpIcon';
import Toggle from '../Form/Toggle';
import Input from '../Form/Input';
import { TOP_ANAT_FLOW } from '../../hooks/useTopAnat';
import {
  topAnatAdvancedOptsNotDefault,
  topAnatLabelClassNames,
} from '../../helpers/constants/topAnat';
import GenesDetailsModal from './GenesDetailsModal';
import classnames from '../../helpers/classnames';
import imagePath from '../../helpers/imagePath';
import usePrevious from '../../hooks/usePrevious';
import { FULL_LENGTH_LABEL } from '../../api/prod/constant';

const TopAnatForm = ({
  form: { handleChange, data: formData, errors },
  requestParameters: rp,
  handlers: {
    foregroundHandler,
    backgroundHandler,
    setRP,
    onSelectCustomStage,
    checkBoxHandler,
  },
  status,
}) => {
  const prevStatus = usePrevious(status);
  const formAvailable = React.useMemo(() => {
    switch (status) {
      case TOP_ANAT_FLOW.LOADING:
        return false;
      case TOP_ANAT_FLOW.GETTING_RESULTS:
      case TOP_ANAT_FLOW.GETTING_JOB:
        return formData.genes !== '';
      default:
        return true;
    }
  }, [status, formData]);
  const formDisabled = React.useMemo(
    () => status !== TOP_ANAT_FLOW.NEW_JOB,
    [status]
  );
  const [expandOpts, setExpandOpts] = React.useState(false);

  useEffect(() => {
    if (prevStatus !== status && status === 'gotResults') {
      setExpandOpts(topAnatAdvancedOptsNotDefault(formData));
    }
  }, [prevStatus, status, formData]);

  return !formAvailable ? null : (
    <>
      <Bulma.Columns>
        <Bulma.C size={4}>
          <article className="message is-small">
            <div className="message-header">
              <p className="is-size-6">Gene list</p>
            </div>
            {rp.fg &&
              rp?.fg?.list?.selectedSpecies &&
              rp?.fg?.list?.detectedSpecies && (
                <div
                  className="message-body is-flex"
                  style={{ position: 'relative', height: '100px' }}
                >
                  <div
                    className="is-flex is-align-items-center"
                    style={{ marginRight: 50 }}
                  >
                    <p className="mr-1">{rp.fg.message}</p>
                    <InfoIcon
                      title="Gene detection details"
                      tooltip="See gene list details"
                      content={<GenesDetailsModal data={rp.fg.list} />}
                    />
                  </div>
                  <Bulma.Image
                    className="no-responsive"
                    style={{
                      height: 60,
                      width: 70,
                      position: 'absolute',
                      top: 20,
                      right: 0,
                    }}
                    src={imagePath(
                      `/species/${rp?.fg?.list?.selectedSpecies}_light.jpg`
                    )}
                    alt="species image"
                    imgClassnames="top-anat-species"
                  />
                </div>
              )}
          </article>
          <div className="field">
            <TextArea
              rows={10}
              placeholder="Enter a list of gene identifiers, one ID per line, no quotes, no comma."
              onChange={foregroundHandler}
              error={errors.genes}
              value={formData.genes}
              disabled={formDisabled}
            />
          </div>
        </Bulma.C>
        {rp.fg && rp?.fg?.list?.selectedSpecies && (
          <>
            <Bulma.C size={4}>
              <article className="message is-small">
                <div className="message-header">
                  <p className="is-size-6">Background</p>
                  <HelpIcon
                    title="Custom background"
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '7px',
                    }}
                    content={
                      <>
                        By default, the gene universe considered for the
                        enrichment analysis is all genes with data in Bgee for
                        the selected species. It is possible to provide a custom
                        gene universe, as a list of gene IDs. All gene IDs
                        present in the foreground must be present in the
                        background.
                      </>
                    }
                  />
                </div>
                {rp.fg?.list?.detectedSpecies && (
                  <div
                    className={classnames(
                      'message-body',
                      'is-flex',
                      'is-flex-direction-column-reverse',
                      'is-justify-content-space-between'
                    )}
                    style={{ height: '100px' }}
                  >
                    <div className="is-flex is-align-items-end is-justify-content-end">
                      <div className="field has-addons">
                        <p className="control">
                          <Bulma.Button
                            size="small"
                            className="toggle-button"
                            color={!rp.customBg && 'danger'}
                            onClick={() =>
                              setRP((prev) => ({ ...prev, customBg: false }))
                            }
                            disabled={
                              formDisabled || (!formDisabled && !rp.customBg)
                            }
                          >{`Bgee data for ${
                            rp.fg.list.detectedSpecies[
                              rp.fg.list.selectedSpecies
                            ].name
                          }`}</Bulma.Button>
                        </p>
                        <p className="control">
                          <Bulma.Button
                            size="small"
                            className="toggle-button"
                            color={rp.customBg && 'danger'}
                            onClick={() =>
                              setRP((prev) => ({ ...prev, customBg: true }))
                            }
                            disabled={
                              formDisabled || (!formDisabled && rp.customBg)
                            }
                          >
                            Custom data
                          </Bulma.Button>
                        </p>
                      </div>
                    </div>
                    {rp.customBg && rp.bg && (
                      <div className="is-flex is-align-items-center">
                        <p className="mr-1">{rp.bg?.message}</p>
                        <InfoIcon
                          title="Gene detection details"
                          tooltip="See gene list details"
                          content={<GenesDetailsModal data={rp.bg?.list} />}
                        />
                      </div>
                    )}
                  </div>
                )}
              </article>
              {rp.customBg && (
                <div className="field">
                  <TextArea
                    rows={10}
                    placeholder={`Gene identifiers from ${
                      rp.fg.list.detectedSpecies[rp.fg.list.selectedSpecies]
                        .name
                    } genome, one ID per line (no quotes, no comma).`}
                    onChange={backgroundHandler}
                    error={errors.genes}
                    value={formData.genesBg}
                    disabled={formDisabled}
                  />
                </div>
              )}
            </Bulma.C>
            <Bulma.C size={4}>
              <article className="message is-small">
                <div className="message-header">
                  <p className="is-size-6">Analysis options</p>
                </div>
              </article>
              <div>
                <p className="has-text-weight-semibold mb-2">
                  Expression types
                </p>
                <p>Present</p>
                <p className="has-text-weight-semibold my-2">Data types</p>
                <div className="control">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      className="mr-2"
                      disabled={formDisabled}
                      onChange={checkBoxHandler('rnaSeq')}
                      checked={formData.rnaSeq}
                    />
                    <span
                      className={classnames({
                        'not-default': !formData.rnaSeq,
                      })}
                    >
                      RNA-Seq
                    </span>
                  </label>
                </div>
                <div className="control">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      className="mr-2"
                      disabled={formDisabled}
                      onChange={checkBoxHandler('full')}
                      checked={formData.full}
                    />
                    <span
                      className={classnames({
                        'not-default': !formData.full,
                      })}
                    >
                      {FULL_LENGTH_LABEL}
                    </span>
                  </label>
                </div>
                <div className="control">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      className="mr-2"
                      disabled={formDisabled}
                      onChange={checkBoxHandler('affymetrix')}
                      checked={formData.affymetrix}
                    />
                    <span
                      className={classnames({
                        'not-default': !formData.affymetrix,
                      })}
                    >
                      Affymetrix data
                    </span>
                  </label>
                </div>
                <div className="control">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      className="mr-2"
                      disabled={formDisabled}
                      onChange={checkBoxHandler('inSitu')}
                      checked={formData.inSitu}
                    />
                    <span
                      className={classnames({
                        'not-default': !formData.inSitu,
                      })}
                    >
                      In situ hybridization
                    </span>
                  </label>
                </div>
                <div className="control">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      className="mr-2"
                      disabled={formDisabled}
                      onChange={checkBoxHandler('est')}
                      checked={formData.est}
                    />
                    <span
                      className={classnames({ 'not-default': !formData.est })}
                    >
                      EST
                    </span>
                  </label>
                </div>
              </div>
            </Bulma.C>
          </>
        )}
      </Bulma.Columns>
      <Bulma.Columns>
        <Bulma.C size={12}>
          <a onClick={() => setExpandOpts(!expandOpts)}>
            <article className="message  is-small">
              <div className="message-header">
                <p className="is-size-5">Advanced Options</p>
                <span className={`icon is-medium ${expandOpts ? 'open' : ''}`}>
                  <ion-icon name="chevron-up-outline" size="large" />
                </span>
              </div>
            </article>
          </a>
          <div
            className="mt-5"
            style={{ display: expandOpts ? 'block' : 'none' }}
          >
            <Bulma.Columns>
              <Bulma.C size={6}>
                <div className="field">
                  <label
                    className={topAnatLabelClassNames(
                      'stages',
                      formData.stages
                    )}
                    htmlFor="stages"
                  >
                    Development and life stages
                    <HelpIcon
                      title="Developmental and life stages"
                      style={{
                        position: 'absolute',
                      }}
                      content={
                        <>
                          By default, all developmental and life stages are
                          considered for the enrichment analysis. It is possible
                          to provide a custom selection of developmental and
                          life stages, selecting one or several developmental
                          and life stages.
                        </>
                      }
                    />
                  </label>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <Toggle
                          elements={[
                            { value: 'all', text: 'All stages' },
                            { value: 'custom', text: 'Custom stages' },
                          ]}
                          value={formData.stages === 'all' ? 'all' : 'custom'}
                          onChange={onSelectCustomStage()}
                          error={errors.stages}
                          disabled={formDisabled || !rp.fg?.list?.stages}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {rp?.fg?.list?.stages && Array.isArray(formData.stages) && (
                  <div className="field">
                    <div className="control">
                      {rp?.fg?.list?.stages.map((s) => (
                        <div className="control" key={s.id}>
                          <label className="checkbox">
                            <input
                              type="checkbox"
                              className="mr-2"
                              disabled={formDisabled}
                              onChange={onSelectCustomStage(s.id)}
                              checked={
                                formData.stages.findIndex((a) => a === s.id) >=
                                0
                              }
                            />
                            {s.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Bulma.C>
              <Bulma.C size={6}>
                <div className="field">
                  <label
                    className={topAnatLabelClassNames(
                      'dataQuality',
                      formData.dataQuality
                    )}
                    htmlFor="dataQuality"
                  >
                    Data quality
                    <HelpIcon
                      title="Data quality"
                      style={{
                        position: 'absolute',
                      }}
                      content={
                        <>
                          For each data type, Bgee applies dedicated analysis to
                          generate calls of baseline presence/absence of
                          expression, and of over-/under-expression, and to
                          assign a level of confidence to the data: silver or
                          gold. This field allows to specify whether the
                          analysis should be based on data of any quality level,
                          or on data of high quality level only.
                        </>
                      }
                    />
                  </label>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <Toggle
                          elements={[
                            { value: 'all', text: 'All' },
                            { value: 'gold', text: 'Gold confidence' },
                          ]}
                          value={formData.dataQuality}
                          onChange={handleChange('dataQuality', (v) => v)}
                          error={errors.dataQuality}
                          disabled={formDisabled}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Bulma.C>
            </Bulma.Columns>
            <Bulma.Columns>
              <Bulma.C size={12}>
                <div className="field">
                  <label
                    className={topAnatLabelClassNames(
                      'decorrelationType',
                      formData.decorrelationType
                    )}
                    htmlFor="decorrelationType"
                  >
                    Decorrelation type (slower)
                    <HelpIcon
                      title="Decorrelation typey"
                      style={{
                        position: 'absolute',
                      }}
                      content={
                        <>
                          Algorithm used to take into account the topology of
                          the anatomical ontology, to decrease the number of
                          false positives and highly general terms in the
                          results, owing to the inheritance problem. A precise
                          description of these algorithms can be found in the
                          topGO documentation. Please note that using these
                          decorrelation methods slow the analyses a lot.
                        </>
                      }
                    />
                  </label>
                  <div className="field-body">
                    <div className="field">
                      <Toggle
                        disabled={formDisabled}
                        elements={[
                          {
                            value: 'classic',
                            text: 'No decorrelation',
                          },
                          { value: 'elim', text: 'Elim' },
                          { value: 'weight', text: 'Weight' },
                          { value: 'parent-child', text: 'Parent-child' },
                        ]}
                        value={formData.decorrelationType}
                        onChange={handleChange('decorrelationType', (v) => v)}
                        error={errors.decorrelationType}
                      />
                    </div>
                  </div>
                </div>
              </Bulma.C>
            </Bulma.Columns>
            <Bulma.Columns>
              <Bulma.C size={6}>
                <div className="field">
                  <label
                    className={topAnatLabelClassNames(
                      'nodeSize',
                      formData.nodeSize
                    )}
                    htmlFor="nodeSize"
                  >
                    Node size
                    <HelpIcon
                      title="Node size"
                      style={{
                        position: 'absolute',
                      }}
                      content={
                        <>
                          Parameter allowing to prune the anatomical ontology
                          from the terms which have a number of genes with data
                          lower than this cutoff.
                        </>
                      }
                    />
                  </label>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <Input
                          disabled={formDisabled}
                          value={formData.nodeSize}
                          onChange={handleChange('nodeSize')}
                          error={errors.nodeSize}
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Bulma.C>
              <Bulma.C size={6}>
                <div className="field">
                  <label
                    className={topAnatLabelClassNames(
                      'nbNode',
                      formData.nbNode
                    )}
                    htmlFor="nbNode"
                  >
                    Nb of nodes
                    <HelpIcon
                      title="Number of nodes"
                      style={{
                        position: 'absolute',
                      }}
                      content={
                        <>
                          Number of significant nodes to be displayed in the
                          generated graph of results (visualization purpose
                          only, no impact on the results of the analysis).
                        </>
                      }
                    />
                  </label>
                  <div className="field-body">
                    <div className="field">
                      <Input
                        disabled={formDisabled}
                        value={formData.nbNode}
                        onChange={handleChange('nbNode')}
                        error={errors.nbNode}
                        type="number"
                      />
                    </div>
                  </div>
                </div>
              </Bulma.C>
            </Bulma.Columns>
            <Bulma.Columns>
              <Bulma.C size={6}>
                <div className="field">
                  <label
                    className={topAnatLabelClassNames(
                      'fdrThreshold',
                      formData.fdrThreshold
                    )}
                    htmlFor="fdrThreshold"
                  >
                    FDR threshold
                    <HelpIcon
                      title="FDR threshold"
                      style={{
                        position: 'absolute',
                      }}
                      content={
                        <>
                          Anatomical terms with a FDR higher than this threshold
                          will not be considered as significant.
                        </>
                      }
                    />
                  </label>
                  <div className="field-body">
                    <div className="field">
                      <Input
                        disabled={formDisabled}
                        value={formData.fdrThreshold}
                        onChange={handleChange('fdrThreshold')}
                        error={errors.fdrThreshold}
                      />
                    </div>
                  </div>
                </div>
              </Bulma.C>
              <Bulma.C size={6}>
                <div className="field">
                  <label
                    className={topAnatLabelClassNames(
                      'pValueThreshold',
                      formData.pValueThreshold
                    )}
                    htmlFor="pValueThreshold"
                  >
                    p-value threshold
                    <HelpIcon
                      title="p-value threshold"
                      style={{
                        position: 'absolute',
                      }}
                      content={
                        <>
                          Anatomical terms with a p-value higher than this
                          threshold will not be considered as significant.
                        </>
                      }
                    />
                  </label>
                  <div className="field-body">
                    <div className="field">
                      <Input
                        disabled={formDisabled}
                        value={formData.pValueThreshold}
                        onChange={handleChange('pValueThreshold')}
                        error={errors.pValueThreshold}
                      />
                    </div>
                  </div>
                </div>
              </Bulma.C>
            </Bulma.Columns>
          </div>
        </Bulma.C>
      </Bulma.Columns>

      <div className="field is-grouped">
        <Input
          controlClassName="has-icons-left"
          type="email"
          disabled={formDisabled}
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="Email"
          error={errors.email}
          icons={
            <span className="icon is-left">
              <ion-icon name="mail-outline" />
            </span>
          }
        />
        <Input
          controlClassName="has-icons-left"
          value={formData.jobDescription}
          onChange={handleChange('jobDescription')}
          placeholder="Job description"
          error={errors.jobDescription}
          disabled={formDisabled}
          icons={
            <span className="icon is-left">
              <ion-icon name="document-outline" />
            </span>
          }
        />
      </div>
    </>
  );
};

export default TopAnatForm;
