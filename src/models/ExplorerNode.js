import { nanoid } from "nanoid";

const ExplorerNode = function (name, isFolder) {
  this.name = name;
  this.isFolder = isFolder;
  this.isExpanded = false;
  this.id = nanoid();
  this.children = [];

  this.toggleView = function () {
    this.isExpanded = !this.isExpanded;
  };
  this.updateName = function (updatedName) {
    this.name = updatedName;
  };
};

export default ExplorerNode;
