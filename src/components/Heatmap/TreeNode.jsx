import React, { useRef } from 'react';

const TreeNode = ({ node, depth, index, yScale, toggleCollapse, labelFont }) => {
  // const [collapsed, setCollapsed] = useState(false);
  const gRef = useRef(null);
  // const [width, setWidth] = useState(0);
  // const [height, setHeight] = useState(0);

  /*
  useEffect(() => {
    if (gRef.current) {
      const bbox = gRef.current.getBBox();
      setWidth(bbox.width);
      setHeight(bbox.height);
    }
    if (node.isTopLevelTerm && depth > 0) {
      setCollapsed(true);
    }
  }, []);
  */

  // const toggleCollapse = () => setCollapsed(!collapsed);
  const onToggleClick = (event, term) => {
    toggleCollapse(term);
  }

  const hasChildren = node.children && node.children.length > 0;
  let toggleIcon = '[ ]';
  if (hasChildren || node.isTopLevelTerm) {
    toggleIcon = node.isExpanded ? '[-]' : '[+]';
  }

  // const y = yScale(node.label);
  const y = yScale(node.id);
  const yPos = y + yScale.bandwidth() / 2;
  const bandwidth = yScale.bandwidth();
  // const lastChildYPos = Math.max(...node.children.map(n => yScale(n.label)));
  const lastChildYPos = Math.max(...node.children.map(n => yScale(n.id)));

  return (
    // <g ref={gRef} id={node.id} transform={`translate(0, ${(index + depth) * 20})`}>
    <g ref={gRef} id={node.id}>
      {depth > 0 && (
        <line
          x1={(depth-1) * 20 + 5}
          y1={yPos-2}
          x2={(depth-1) * 20 + 20}
          y2={yPos-2}
          stroke="black"
        />
      )}
      { depth < 2 ? (
        <text 
          x={depth * 20}
          y={yPos}
          fontSize="12"
          {...(hasChildren || node.isTopLevelTerm ? {
            onClick: (e) => onToggleClick(e, node),
            style: { cursor: 'pointer' }
          } : {})}
        >
          {toggleIcon}
        </text>
      ) : null }

      { false && ( <text x={depth < 2 ? depth * 20 + 20 : depth * 20 + 10} y={yPos} fontSize="12">{node.label}</text> ) }
      
      
      { node.cellTypeLabel && node.cellTypeId !== 'GO:0005575' ? (
        <text 
          x={depth < 2 ? depth * 20 + 20 : depth * 20 + 10}
          y={yPos}
          fontSize="14"
          fontFamily={labelFont}
        >
          
          <tspan>{node.cellTypeLabel}</tspan>
          <tspan fontStyle="italic" fill="gray"> in </tspan>
          <tspan>{node.anatEntityLabel}</tspan>
        </text>
      ) : (
        <text
          x={depth < 2 ? depth * 20 + 20 : depth * 20 + 10}
          y={yPos}
          fontSize="14"
          fontFamily={labelFont}
        >
          <tspan>{node.label}</tspan>
        </text>
      )}
        
      
      {hasChildren && ( // yPos + 2 + (numVisibleChildren-1) * bandwidth
        <>
          <line
            x1={depth * 20 + 5}
            y1={yPos + 2}
            x2={depth * 20 + 5}
            y2={node.isExpanded ? lastChildYPos+bandwidth/2-3 : yPos+2}
            stroke="black"
          />
          {node.isExpanded && node.children.map((child, childIndex) => (
            <React.Fragment key={child.id}>
              <TreeNode
                node={child}
                depth={depth + 1}
                index={index + childIndex + 1}
                yScale={yScale}
                toggleCollapse={toggleCollapse}
                labelFont={labelFont}
              />
            </React.Fragment>
          ))}
        </>
      )}
    </g>
  );
};

export default TreeNode;
