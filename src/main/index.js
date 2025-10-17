import { app, shell, BrowserWindow, ipcMain, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import db from './db'
import testmgr from './testmgr'
import createWsServer from './server'
import path from 'path'
import { defaultBrowserWindowOptions } from '@electron-toolkit/utils'


app.setPath('userData', path.join(app.getPath('appData'), 'K-Desk'));
function createWindow() {
  const ses = session.fromPartition('persist:kdesk');

  // Create the browser window.
  const mainWindow = new BrowserWindow({ ...defaultBrowserWindowOptions, session: ses })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.kiosk-seat-sample')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // IPC handlers for database operations
  ipcMain.handle('get-db-schema', async () => {
    try {
      const schemaVersion = db.pragma('schema_version')
      return { success: true, data: schemaVersion }
    } catch (error) {
      console.error('Database error:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('get-users', async () => {
    try {
      const users = db.prepare('SELECT * FROM users').all()
      return { success: true, data: users }
    } catch (error) {
      console.error('Database error:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('get-posts', async () => {
    try {
      const posts = db.prepare(`
        SELECT p.*, u.name as author_name
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
      `).all()
      return { success: true, data: posts }
    } catch (error) {
      console.error('Database error:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('getAllUsers', async () => {
    return { success: true, data: testmgr.getUsers() }
  })

  ipcMain.handle('getAllUserCount', async () => {
    try {
      const result = testmgr.getAllUserCount()
      return { success: true, data: result['count(*)'] }
    } catch (error) {
      console.error('Database error:', error)
      return { success: false, error: error.message }
    }
  })

  // 테이블 목록 조회
  ipcMain.handle('get-table-list', async () => {
    try {
      const tables = db.prepare(`
        SELECT name FROM sqlite_master
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name
      `).all()
      return { success: true, data: tables }
    } catch (error) {
      console.error('Database error:', error)
      return { success: false, error: error.message }
    }
  })

  // 특정 테이블의 스키마 정보 조회
  ipcMain.handle('get-table-schema', async (event, tableName) => {
    try {
      const schema = db.prepare(`PRAGMA table_info(${tableName})`).all()
      return { success: true, data: schema }
    } catch (error) {
      console.error('Database error:', error)
      return { success: false, error: error.message }
    }
  })

  // 특정 테이블의 데이터 조회
  ipcMain.handle('get-table-data', async (event, tableName, limit = 100) => {
    try {
      const data = db.prepare(`SELECT * FROM ${tableName} LIMIT ?`).all(limit)
      return { success: true, data: data }
    } catch (error) {
      console.error('Database error:', error)
      return { success: false, error: error.message }
    }
  })

  await createWsServer()
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
})



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
