"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  // Database operations
  getDbSchema: () => electron.ipcRenderer.invoke("get-db-schema"),
  getUsers: () => electron.ipcRenderer.invoke("get-users"),
  getPosts: () => electron.ipcRenderer.invoke("get-posts"),
  getAllUsers: () => electron.ipcRenderer.invoke("getAllUsers"),
  getAllUserCount: () => electron.ipcRenderer.invoke("getAllUserCount"),
  // Table operations
  getTableList: () => electron.ipcRenderer.invoke("get-table-list"),
  getTableSchema: (tableName) => electron.ipcRenderer.invoke("get-table-schema", tableName),
  getTableData: (tableName, limit) => electron.ipcRenderer.invoke("get-table-data", tableName, limit)
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
