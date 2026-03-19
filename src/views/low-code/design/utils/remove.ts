export function removeBlock(blockId, config) {
  const parentBlock = findParentBlock(blockId, config);
  if (parentBlock) {
    parentBlock.children.splice(
      parentBlock.children.findIndex(f => f.uid === blockId),
      1,
    );
  }
}

export function findParentBlock(blockId, parentBlockConfig) {
  if (!parentBlockConfig?.children?.length) {
    return null;
  }
  const targetBlock = parentBlockConfig.children.find(f => f.uid === blockId);
  if (targetBlock) {
    return parentBlockConfig;
  } else {
    for (let i = 0; i < parentBlockConfig.children.length; i++) {
      const parentBlock = findParentBlock(blockId, parentBlockConfig.children[i]);
      if (parentBlock) {
        return parentBlock;
      }
    }
    return null;
  }
}
