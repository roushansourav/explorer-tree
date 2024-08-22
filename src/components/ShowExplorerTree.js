import React, { useState, memo, useRef, useEffect } from "react";
import { FcFolder } from "react-icons/fc";
import { FcOpenedFolder } from "react-icons/fc";
import { FaRegFileAlt } from "react-icons/fa";
import { FaFolderPlus } from "react-icons/fa6";
import { FaFolderMinus } from "react-icons/fa6";
import { FaFolder } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDone } from "react-icons/md";
import { MdCreateNewFolder } from "react-icons/md";
import { FaFileMedical } from "react-icons/fa";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

import ExplorerNode from "../models/ExplorerNode";

const ShowExplorerTree = ({ node, toggleNode, reNameNode, insertNode }) => {
  const { isFolder, children = [], name, id, isExpanded = false } = node;

  const newNodeNameEle = useRef(null);
  const newNodeInputEle = useRef(null);

  const [enableInput, setEnableInput] = useState(false);
  const [nodeName, setNodeName] = useState(name);
  const [newNodeName, setNewNodeName] = useState("");
  const [newNodeInput, setNewNodeInput] = useState(false);
  const [contentType, setContentType] = useState("file");

  const insertFile = (id) => {
    const newNode = new ExplorerNode(newNodeName, false);
    insertNode(id, newNode);
  };

  const insertFolder = (id) => {
    const newNode = new ExplorerNode(newNodeName, true);
    insertNode(id, newNode);
  };

  const showNodeIcon = () => {
    if (isFolder && isExpanded) {
      return <FolderOpenIcon style={{ color: "rgb(255, 175, 0)" }} />;
    }
    if (isFolder && !isExpanded) {
      return <FolderIcon style={{ color: "rgb(255, 175, 0)" }} />;
    }

    return <TextSnippetIcon style={{ color: "blue" }} />;
  };

  const handleFolderAdd = (e) => {
    e.stopPropagation();
    setNewNodeInput(true);
    setContentType("folder");
    !node.isExpanded && toggleNode(id, node);
  };

  const handleFileAdd = (e) => {
    e.stopPropagation();
    setNewNodeInput(true);
    setContentType("file");
    !node.isExpanded && toggleNode(id, node);
  };

  const handleNodeNameUpdate = (e) => {
    e.stopPropagation();
    if (e.key === "Enter" && nodeName) {
      reNameNode(node, id, nodeName);
      setEnableInput(false);
    }
  };

  const handleNodeAdd = (e) => {
    if (e.key === "Enter" && newNodeName) {
      if (contentType === "file") {
        insertFile(id);
      } else {
        insertFolder(id);
      }
      setNewNodeInput(false);
      setNewNodeName("");
      setContentType("");
    }
  };

  const enableNodeNameUpdateInput = (e) => {
    e.stopPropagation();
    setEnableInput(true);
  };

  useEffect(() => {
    if (enableInput) {
      newNodeNameEle.current?.focus();
    }
  }, [enableInput, newNodeNameEle.current]);

  useEffect(() => {
    if (newNodeInput) {
      newNodeInputEle.current?.focus();
    }
  }, [newNodeInput, newNodeInputEle.current]);

  return (
    <div key={id} style={{ textAlign: "left" }}>
      <div
        style={{
          height: "20px",
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            toggleNode(id, node);
          }}
        >
          {showNodeIcon()}
        </span>
        {enableInput ? (
          <input
            ref={newNodeNameEle}
            value={nodeName}
            onChange={(e) => {
              setNodeName(e.target.value);
            }}
            onKeyDown={handleNodeNameUpdate}
          />
        ) : (
          <span onClick={enableNodeNameUpdateInput}>{name}</span>
        )}
        {isFolder && (
          <>
            <span onClick={handleFolderAdd}>
              <CreateNewFolderIcon style={{ color: "rgb(255, 175, 0)" }} />
            </span>
            <span onClick={handleFileAdd}>
              <ControlPointIcon style={{ color: "blue" }} />
            </span>
          </>
        )}
      </div>
      {isExpanded && (
        <div style={{ marginLeft: "16px" }}>
          {newNodeInput ? (
            <input
              ref={newNodeInputEle}
              placeholder={`Enter ${contentType} name`}
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              onKeyDown={handleNodeAdd}
            />
          ) : null}
          {children.length
            ? children.map((childNode) => (
                <ShowExplorerTree
                  key={childNode.id}
                  node={childNode}
                  toggleNode={toggleNode}
                  reNameNode={reNameNode}
                  insertNode={insertNode}
                />
              ))
            : null}
        </div>
      )}
    </div>
  );
};

export default memo(ShowExplorerTree);
