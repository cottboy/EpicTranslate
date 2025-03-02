const { app, BrowserWindow, ipcMain, shell, nativeImage } = require('electron')
const path = require('path')
const Store = require('electron-store')
const fs = require('fs')

// 初始化存储
const store = new Store()

function createWindow() {
  // 确定正确的图标路径
  let iconPath;
  if (app.isPackaged) {
    // 打包后的路径
    iconPath = path.join(process.resourcesPath, 'assets/icon.ico');
  } else {
    // 开发环境路径
    iconPath = path.resolve(__dirname, '../assets/icon.ico');
  }

  // 使用 nativeImage 加载图标
  const icon = nativeImage.createFromPath(iconPath);
  
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: false,
    autoHideMenuBar: true,
    title: 'EpicTranslate（学习用途）',
    icon: icon
  })

  win.loadFile('index.html')

  // 添加窗口控制事件监听
  ipcMain.on('window-minimize', () => {
    win.minimize()
  })

  ipcMain.on('window-maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })

  ipcMain.on('window-close', () => {
    win.close()
  })

  // 监听窗口最大化状态变化
  win.on('maximize', () => {
    win.webContents.send('window-maximized', true)
  })

  win.on('unmaximize', () => {
    win.webContents.send('window-maximized', false)
  })
}

// 在 app.whenReady() 之前
if (process.platform === 'win32') {
  app.setAppUserModelId('com.epictranslate.app');
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}) 