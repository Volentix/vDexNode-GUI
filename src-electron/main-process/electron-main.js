import { app, BrowserWindow, Menu, shell, Tray, ipcMain, nativeImage } from 'electron'
import { autoUpdater } from 'electron-updater'
const path = require('path')
const log = require('electron-log')
import vdexnodeMenu from './electron-menu'
const vdexMenu = vdexnodeMenu(app, shell)
/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    // width: 1000,
    // height: 600,
    useContentSize: true,
    resizable: true,
    title: 'vDexNode GUI',
    center: true,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true
    }
  })

  mainWindow.maximize()
  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  Menu.setApplicationMenu(Menu.buildFromTemplate(vdexMenu))
}

app.setAppUserModelId('io.volentix.vdexnode')

let iconPath
if (process.env.PROD) {
  iconPath = path.join(__dirname, 'statics/tray')
} else {
  iconPath = path.join('src/statics/tray')
}

let tray = null
app.on('ready', () => {
  tray = new Tray(nativeImage.createFromPath(iconPath + '/vdexTemplate.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: app.getName() + ': ' + app.getVersion(), enabled: false },
    { type: 'separator' },
    { label: 'Check for updates', enabled: false },
    { label: 'Settings', enabled: false },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        mainWindow.destroy()
        app.quit()
      }
    }
  ])
  tray.setTitle('')
  tray.setToolTip(app.getName())
  // tray.setContextMenu(contextMenu)
  tray.on('double-click', toggleWindow)
  tray.on('click', event => {
    toggleWindow()
    // Show devtools when command clicked
    if (mainWindow.isVisible() && process.defaultApp && event.metaKey) {
      mainWindow.openDevTools({
        mode: 'detach'
      })
    }
  })
  tray.on('right-click', event => {
    tray.popUpContextMenu(contextMenu)
  })
})

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
    mainWindow.focus()
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
