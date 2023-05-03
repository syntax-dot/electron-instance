import { app, BrowserWindow, ipcMain, session, screen } from 'electron'
import { join } from 'path'

function createWindow() {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true
    },

    frame: false,
    movable: false,
    maximizable: true,
    minimizable: false,

    fullscreen: true,

    titleBarStyle: 'hidden'
  })

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2]
    const rendererUrl = `http://localhost:${rendererPort}`
    mainWindow.loadURL(rendererUrl)
  } else {
    const indexHtml = join(app.getAppPath(), 'renderer', 'index.html')
    mainWindow.loadFile(indexHtml)
  }
}

app.whenReady().then(() => {
  createWindow()

  const filter = {
    urls: ['http://localhost:4444/*', 'http://127.0.0.1:4444/*']
  }

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["script-src 'self'"]
      }
    })
  })

  // todo: fix cors
  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      details.requestHeaders['Origin'] = '*'
      callback({ requestHeaders: details.requestHeaders })
    }
  )

  // todo: fix cors
  session.defaultSession.webRequest.onHeadersReceived(
    filter,
    (details, callback) => {
      if (details.responseHeaders)
        details.responseHeaders['Access-Control-Allow-Origin'] = ['*']
      callback({ responseHeaders: details.responseHeaders })
    }
  )

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('set-bounds', async (event, { x, y }) => {
  const [window] = BrowserWindow.getAllWindows()
  window.setBounds({ x, y })
})

ipcMain.handle('get-instance-position', async (event) => {
  const args = process.argv
  const position = args
    .find((a) => a.startsWith('--position='))
    ?.replace('--position=', '')
  return position
})
