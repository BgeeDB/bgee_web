import React from 'react';
import Bulma from '../Bulma';

const MAX_ELEMENTS = 8;

const GeneExpandableList = ({ items, renderElement }) => {
  const [expand, setExpand] = React.useState(false);

  const elements = React.useMemo(() => {
    if (expand || items.length <= MAX_ELEMENTS) return items;
    return items.slice(0, MAX_ELEMENTS);
  }, [items, expand]);

  return (
    <>
      <div className="tags">
        {elements.map((ref, key) => renderElement(ref, key, elements))}
        {items.length > MAX_ELEMENTS && (
          <Bulma.Button
            size="small"
            className="ml-3"
            onClick={() => setExpand((prev) => !prev)}
          >
            <span className="icon">
              <ion-icon
                name={expand ? 'remove-outline' : 'add-outline'}
                size="large"
              />
            </span>
          </Bulma.Button>
        )}
      </div>
    </>
  );
};

export default GeneExpandableList;
