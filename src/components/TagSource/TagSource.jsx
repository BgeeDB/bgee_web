import classnames from '../../helpers/classnames';
import { ALL_DATA_TYPES } from '../../pages/search/rawdata/useLogic';
import './TagSource.scss';

const TagSource = ({ source }) => (
  <div className="tags tags-source">
    {ALL_DATA_TYPES.map((dataType) => {
      const title = `${dataType.label}: ${
        source[dataType.id] ? 'presence' : 'absence'
      }`;
      return (
        <span
          key={dataType.id}
          title={title}
          className={classnames('tag tag-source', {
            present: source[dataType.id],
          })}
        >
          {dataType.sourceLetter}
        </span>
      );
    })}
  </div>
);

export default TagSource;
