import { app, BrowserWindow, ipcMain, session, screen, ipcRenderer } from 'electron'
import { join } from 'path'

export interface BrowserWindows {
  id: string | number
  display: string | number
  instance: BrowserWindow
}

export let windows: BrowserWindows[] = []

function createWindow() {
  const displays = screen.getAllDisplays()

  const newWindow = (bounds: Electron.Rectangle) => {
    return new BrowserWindow({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
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
  }

  for (let [index, display] of displays.entries()) {

    windows.push({
      id: index + 1,
      display: display.label,
      instance: newWindow(display.bounds)
    })
  }


  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2]
    const rendererUrl = `http://localhost:${rendererPort}`
    windows.forEach(window => window.instance.loadURL(rendererUrl))
  } else {
    const indexHtml = join(app.getAppPath(), 'renderer', 'index.html')
    windows.forEach(window => window.instance.loadFile(indexHtml))
  }
}

app.whenReady().then(() => {
  createWindow()
  console.log('windows', windows);


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

ipcMain.on('set-bounds', (event, id, { x, y }) => {
  const X = +x
  const Y = +y

  return windows[id].instance.setBounds({ x: X, y: Y })
})

ipcMain.handle('get-id', async (event) => {
  return windows[event.processId - 4].id;
})

ipcMain.handle('get-instance-position', async (event) => {
  return windows[event.processId - 4].instance.getPosition()
})
