import TreeNode from './TreeNode';

export const Tree = ({ data, yScale, toggleCollapse, labelFont }) => (
  <>
    {data && data.map((node, index) => (
      <TreeNode 
        key={node.id}
        node={node}
        depth={0}
        index={index}
        yScale={yScale}
        toggleCollapse={toggleCollapse}
        labelFont={labelFont}
      />
    ))}
  </>
);

export default Tree;
