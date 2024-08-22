import { useState } from "react";
import { cloneDeep } from "lodash";
import ShowExplorerTree from "./components/ShowExplorerTree";
import { explorer } from "./constants/data";
import "./styles.css";

export default function App() {
  const [indexTree, setIndexTree] = useState(explorer);

  const findNode = (nodeId, node) => {
    const { id, children = [] } = node;
    if (id === nodeId) {
      return node;
    }
    for (let i = 0; i < children.length; i++) {
      const childNode = node.children[i];
      const foundNode = findNode(nodeId, childNode);
      if (foundNode) {
        return foundNode;
      }
    }
  };

  const isRootNode = (id) => id === indexTree.id;

  const toggleNode = (nodeId) => {
    const clonedTree = cloneDeep(indexTree);
    if (isRootNode(nodeId)) {
      clonedTree.toggleView();
    } else {
      const node = findNode(nodeId, indexTree);
      node.toggleView();
      modifyNode(clonedTree, nodeId, node);
    }
    setIndexTree(clonedTree);
  };

  const modifyNode = (node, tragetNodeId, newNodeData) => {
    const { children = [] } = node;
    let targetIndex = null;
    for (let i = 0; i < children.length; i++) {
      const childNode = children[i];
      if (childNode.id === tragetNodeId) {
        targetIndex = i;
        break;
      }
    }
    if (targetIndex !== null) {
      node.children[targetIndex] = {
        ...node.children[targetIndex],
        ...newNodeData,
      };
      return;
    }
    children.forEach((childNode) => {
      modifyNode(childNode, tragetNodeId, newNodeData);
    });
  };

  const reNameNode = (node, targetNodeId, newName) => {
    const clonedTree = cloneDeep(indexTree);
    if (isRootNode(targetNodeId)) {
      clonedTree.name = newName;
    } else {
      const newNodeData = { ...node, name: newName };
      modifyNode(clonedTree, targetNodeId, newNodeData);
    }
    setIndexTree(clonedTree);
  };

  const insertNode = (paretNodeId, node) => {
    const clonedTree = cloneDeep(indexTree);
    if (isRootNode(paretNodeId)) {
      clonedTree.children.push(node);
    } else {
      const parentNode = findNode(paretNodeId, clonedTree);
      if (Array.isArray(parentNode.children)) {
        parentNode.children.push(node);
        parentNode.isExpanded = true;
      } else {
        parentNode.children = [node];
        parentNode.isExpanded = true;
      }
      modifyNode(clonedTree, paretNodeId, parentNode);
    }
    setIndexTree(clonedTree);
  };

  return (
    <div className="App">
      <ShowExplorerTree
        node={indexTree}
        toggleNode={toggleNode}
        isRootNode={isRootNode}
        reNameNode={reNameNode}
        insertNode={insertNode}
      />
    </div>
  );
}
