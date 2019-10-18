import { app, Notification, BrowserWindow, Menu, shell, Tray, ipcMain, nativeImage, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
const path = require('path')
const log = require('electron-log')
import vdexnodeMenu from './electron-menu'
const notifier = require('node-notifier')

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
    minWidth: 1280,
    minHeight: 720,
    useContentSize: true,
    resizable: true,
    title: 'vDexNode Dashboard',
    center: true,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true
    }
  })

  mainWindow.maximize()
  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('close', (event) => {
    event.preventDefault()
    toggleWindow()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    app.quit()
  })

  const vdexMenu = vdexnodeMenu(app, shell, mainWindow)
  Menu.setApplicationMenu(Menu.buildFromTemplate(vdexMenu))
}

let iconPath
if (process.env.PROD) {
  iconPath = path.join(__dirname, 'statics/tray')
} else {
  iconPath = path.join('src/statics/tray')
}

let tray = null
app.on('ready', () => {
  tray = new Tray(nativeImage.createFromPath(iconPath + '/trayTemplate.png'))
  const contextMenu = Menu.buildFromTemplate([
    { label: app.getName() + ': ' + app.getVersion(), enabled: false },
    { type: 'separator' },
    {
      label: 'Check for updates',
      enabled: true,
      click: () => {
        autoUpdater.checkForUpdatesAndNotify()
      }
    },
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

app.on('ready', () => {
  if (process.platform === 'win32') {
    app.setAppUserModelId('io.volentix.vdexnode')
    // app.setAsDefaultProtocolClient('vdexnode')
  }
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

// ipcMain.on('defaultIcon', function () {
//   tray.setImage(nativeImage.createFromPath(iconPath + '/walletTemplate.png'))
// })

// ipcMain.on('updateAvailable', function () {
//   tray.setImage(nativeImage.createFromPath(iconPath + '/walletNewTemplate.png'))
// })

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

function sendStatusToWindow (type = 'message', text) {
  log.info(text)
  mainWindow.webContents.send(type, text)
  // notifier.notify({
  //   title: 'vDexNode',
  //   message: text
  // })
}

// autoUpdater.on('checking-for-update', () => {
//   sendStatusToWindow('Checking for update...')
// })

// autoUpdater.on('update-not-available', (info) => {
//   sendStatusToWindow('Update not available.')
// })

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('notification', 'Update available.')
  try {
    app.dock.setBadge('update')
  } catch (e) {
    log.info('setBadge() does not work on windows.')
  }
  try {
    tray.setImage(nativeImage.createFromPath(iconPath + '/trayUpdateTemplate.png'))
  } catch (e) {
    log.info('setImage() does not work on windows')
  }
})

autoUpdater.on('error', (err) => {
  sendStatusToWindow('error', 'Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (obj) => {
  sendStatusToWindow('message', obj.percent)
})

autoUpdater.on('update-downloaded', function (event) {
  dialog.showMessageBox({
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Update the' + app.getName(),
    message: ('The new version has been downloaded.'),
    detail: 'Please restart the application to apply the updates.'
  }, (index) => {
    if (!index) {
      autoUpdater.quitAndInstall()
    }
  })
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    log.info('Setup check for updates and notify')
    autoUpdater.checkForUpdatesAndNotify()
  }
})
