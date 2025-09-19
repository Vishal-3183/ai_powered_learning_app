const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backendProcess = null;

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // These are needed for CodeMirror's 'require' to work
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

// This function only runs when the app is packaged
function startPackagedBackend() {
    const backendPath = path.join(process.resourcesPath, 'cognidesk-backend.exe');
    console.log(`Starting packaged backend at: ${backendPath}`);
    backendProcess = spawn(backendPath);

    backendProcess.stdout.on('data', (data) => {
        console.log(`Backend: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
        console.error(`Backend Error: ${data}`);
    });
}

app.whenReady().then(() => {
    // Only start the backend automatically if the app is packaged
    if (app.isPackaged) {
        startPackagedBackend();
    }
    
    createWindow();
});

// Make sure to kill the backend server when the app closes
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (backendProcess) {
            console.log('Killing backend process...');
            backendProcess.kill();
        }
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});