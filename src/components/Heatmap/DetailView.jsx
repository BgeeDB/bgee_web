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

export const DetailView = ({ 
  interactionData: data,
  xPos,
  yPos,
  width,
  style,
  onClose
}) => {
// }: TooltipProps) => { // TypeScript specific
  if (!data) {
    return null;
  }

  console.log(`[DetailView] data:\n${JSON.stringify(data)}`);

  return (
    <div
      style={{
        width,
        position: "relative",
        top: xPos,
        left: yPos,
        ...style
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
            padding: '5px'
          }}
        >
          ✕
        </button>

        <div className="card-content">
          <p className="title">Gene</p>
          <div className="content">
            <DetailRow label="ID" value={data.geneId} url={data.geneUrlBgee} />
            <DetailRow label="name" value={data.geneName} />
          </div>
        </div>

        <hr style={{margin: "0px"}} />

        <div className="card-content">
          <p className="title">Condition</p>
          <div className="content">
            <h5>Anatomical Entity</h5>
            <DetailRow label="ID" value={data.anatEntityId} url={data.anatEntityUrlOls} />
            <DetailRow label="name" value={data.anatEntityName} />

            <br />

            <h5>Cell Type</h5>
            <DetailRow label="ID" value={data.cellTypeId} url={data.cellTypeUrlOls} />
            <DetailRow label="name" value={data.cellTypeName} />
          </div>
        </div>

        <hr style={{margin: "0px"}} />

        <div className="card-content">
          <p className="title">Expression</p>
          <div style={{position: "relative", left: 10}}>
            <b>data sources:</b>
          </div>
          <div className="tags tags-source" style={{position: "relative", left: 10}}>
            <div className="tags tags-source" style={{width: "110px"}}>
              { data.hasDataRnaSeq ?
              <span title="bulk RNA-Seq: presence" className="tag tag-source present">R</span>
              :
              <span title="bulk RNA-Seq: absence" className="tag tag-source absent">R</span>
              }
              { data.hasDataScRnaSeq ?
              <span title="scRNA-Seq: presence" className="tag tag-source present">SC</span>
              :
              <span title="scRNA-Seq: absence" className="tag tag-source absent">SC</span>
              }
              { data.hasDataAffy ?
              <span title="Affymetrix data: presence" className="tag tag-source present">A</span>
              :
              <span title="Affymetrix data: absence" className="tag tag-source absent">A</span>
              }
              { data.hasDataInSitu ?
              <span title="In situ hybridization: presence" className="tag tag-source present">I</span>
              :
              <span title="In situ hybridization: absence" className="tag tag-source absent">I</span>
              }
              { data.hasDataEst ?
              <span title="EST: presence" className="tag tag-source present">E</span>
              :
              <span title="EST: absence" className="tag tag-source absent">E</span>
              }
            </div>
          </div>
          <DetailRow label="expressed" value={String(data.isExpressed)} />
          <DetailRow label="expression score" value={String(data.value)} />
          <DetailRow label="max. expression" value={String(data.maxExpScore)} />
          <br/>
          <a href={`/search/raw-data?pageType=proc_expr_values&gene_id=${data.geneId}&species_id=${data.speciesId}&cell_type_id=${data.cellTypeId}&cell_type_descendant=true&stage_descendant=true&anat_entity_descendant=true&anat_entity_id=${data.anatEntityId}`}>
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

const DetailRow = ({ 
  label, 
  value,
  url
}) => (
// }: TooltipRowProps) => ( // TypeScript specific
  <div
    style={{
      position: "relative",
      left: 10,
    }}
  >
    <b>{label}</b>
    <span>: </span>
    {url ? (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {value}
      </a>
    ) : (
      <span>{value}</span>
    )}
  </div>
);

export default DetailView;