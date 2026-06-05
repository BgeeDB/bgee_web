/* TypeScript specific
import { InteractionData } from "./Heatmap";
*/
// import styles from "./tooltip.module.css";

/* TypeScript specific
type TooltipProps = {
  interactionData: InteractionData | null;
  width: number;
  height: number;
};
*/

export const DetailView = ({ interactionData: data, xPos, yPos, width, style, onClose }) => {
  // }: TooltipProps) => { // TypeScript specific
  if (!data) {
    return null;
  }

  const toTermIds = (value) =>
    String(value || '')
      .split(',')
      .map((term) => term.trim())
      .filter(Boolean);
  const anatEntityIds = toTermIds(data.anatEntityId);
  const cellTypeIds = toTermIds(data.cellTypeId);
  const anatEntityUrlsOls = anatEntityIds.map((id) => `http://purl.obolibrary.org/obo/${id.replace(':', '_')}`);
  const cellTypeUrlsOls = cellTypeIds.map((id) => `http://purl.obolibrary.org/obo/${id.replace(':', '_')}`);
  const anatEntityQueryParams = anatEntityIds.map((id) => `&anat_entity_id=${encodeURIComponent(id)}`).join('');
  const cellTypeQueryParams = cellTypeIds.map((id) => `&cell_type_id=${encodeURIComponent(id)}`).join('');

  return (
    <div
      style={{
        width,
        position: 'relative',
        top: xPos,
        left: yPos,
        ...style,
      }}
    >
      <div className="card">
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2em',
            padding: '5px',
          }}
        >
          ✕
        </button>

        {data.speciesId ? (
          <>
            <div className="card-content">
              <p className="title">Species</p>
              <div className="content">
                <DetailRow label="ID" value={data.speciesId} url={data.speciesUrl} />
                <DetailRow label="name" value={data.speciesLabel} />
              </div>
            </div>

            <hr style={{ margin: '0px' }} />
          </>
        ) : null}

        <div className="card-content">
          <p className="title">Gene</p>
          <div className="content">
            <DetailRow label="ID" value={data.geneId} url={data.geneUrlBgee} />
            <DetailRow label="name" value={data.geneName} />
          </div>
        </div>

        <hr style={{ margin: '0px' }} />

        <div className="card-content">
          <p className="title">Condition</p>
          <div className="content">
            <h5>Anatomical Entity</h5>
            <DetailRow label="ID" value={anatEntityIds} url={anatEntityUrlsOls} />
            <DetailRow label="name" value={data.anatEntityName} />

            <br />

            <h5>Cell Type</h5>
            <DetailRow label="ID" value={cellTypeIds} url={cellTypeUrlsOls} />
            <DetailRow label="name" value={data.cellTypeName} />
          </div>
        </div>

        <hr style={{ margin: '0px' }} />

        <div className="card-content">
          <p className="title">Expression</p>
          <div style={{ position: 'relative', left: 10 }}>
            <b>data sources:</b>
          </div>
          <div className="tags tags-source" style={{ position: 'relative', left: 10 }}>
            <div className="tags tags-source" style={{ width: '110px' }}>
              {data.hasDataRnaSeq ? (
                <span title="bulk RNA-Seq: presence" className="tag tag-source present">
                  R
                </span>
              ) : (
                <span title="bulk RNA-Seq: absence" className="tag tag-source absent">
                  R
                </span>
              )}
              {data.hasDataScRnaSeq ? (
                <span title="scRNA-Seq: presence" className="tag tag-source present">
                  SC
                </span>
              ) : (
                <span title="scRNA-Seq: absence" className="tag tag-source absent">
                  SC
                </span>
              )}
              {data.hasDataAffy ? (
                <span title="Affymetrix data: presence" className="tag tag-source present">
                  A
                </span>
              ) : (
                <span title="Affymetrix data: absence" className="tag tag-source absent">
                  A
                </span>
              )}
              {data.hasDataInSitu ? (
                <span title="In situ hybridization: presence" className="tag tag-source present">
                  I
                </span>
              ) : (
                <span title="In situ hybridization: absence" className="tag tag-source absent">
                  I
                </span>
              )}
              {data.hasDataEst ? (
                <span title="EST: presence" className="tag tag-source present">
                  E
                </span>
              ) : (
                <span title="EST: absence" className="tag tag-source absent">
                  E
                </span>
              )}
            </div>
          </div>
          <DetailRow label="expressed" value={String(data.isExpressed)} />
          <DetailRow label="expression score" value={String(data.value)} />
          <br />
          <a
            href={
              `/search/raw-data?pageType=proc_expr_values` +
              `&gene_id=${data.geneId}` +
              `&species_id=${data.speciesId}` +
              cellTypeQueryParams +
              anatEntityQueryParams +
              `&cell_type_descendant=true` +
              `&stage_descendant=true` +
              `&anat_entity_descendant=true`
            }
          >
            See source data
          </a>
        </div>
      </div>
    </div>
  );
};

/* TypeScript specific
type DetailRowProps = {
  label: string;
  value: string;
};
*/

const DetailRow = ({ label, value, url }) => (
  // }: TooltipRowProps) => ( // TypeScript specific
  <div
    style={{
      position: 'relative',
      left: 10,
    }}
  >
    <b>{label}</b>
    <span>: </span>
    {Array.isArray(value) ? (
      value.map((item, index) => (
        <span key={`${label}-${item}`}>
          {index > 0 && ', '}
          {Array.isArray(url) && url[index] ? (
            <a href={url[index]} target="_blank" rel="noopener noreferrer">
              {item}
            </a>
          ) : (
            <span>{item}</span>
          )}
        </span>
      ))
    ) : url ? (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {value}
      </a>
    ) : (
      <span>{value}</span>
    )}
  </div>
);

export default DetailView;
