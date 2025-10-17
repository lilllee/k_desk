import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // Database operations
  getDbSchema: () => ipcRenderer.invoke('get-db-schema'),
  getUsers: () => ipcRenderer.invoke('get-users'),
  getPosts: () => ipcRenderer.invoke('get-posts'),
  getAllUsers: () => ipcRenderer.invoke('getAllUsers'),
  getAllUserCount: () => ipcRenderer.invoke('getAllUserCount'),
  // Table operations
  getTableList: () => ipcRenderer.invoke('get-table-list'),
  getTableSchema: (tableName) => ipcRenderer.invoke('get-table-schema', tableName),
  getTableData: (tableName, limit) => ipcRenderer.invoke('get-table-data', tableName, limit)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
