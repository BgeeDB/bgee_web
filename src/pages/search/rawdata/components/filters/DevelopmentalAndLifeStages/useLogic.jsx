import { useCallback } from 'react';
import { getIdAndNameLabel } from '../../../../../../helpers/selects';

const flattenNode = (node) => {
  const flattenedNodes = [];
  const queue = [node];

  while (queue.length) {
    const current = queue.shift();

    if (current) {
      flattenedNodes.push(current);
      queue.unshift(...(current.descendants || []));
    }
  }

  return flattenedNodes;
};

export const flattenDevStagesList = (devStages) => {
  const flattenedNodes = devStages.map((node) => flattenNode(node));
  return flattenedNodes.reduce((acc, list) => [...acc, ...list], []);
};

const useLogic = ({ devStages }) => {
  const getOptionsFunction = useCallback(() => {
    const list = flattenDevStagesList(devStages);
    return list.map((item) => ({
      label: getIdAndNameLabel(item),
      value: item.id,
      level: item.level - 1,
    }));
  }, [devStages]);

  return { getOptionsFunction };
};

export default useLogic;
