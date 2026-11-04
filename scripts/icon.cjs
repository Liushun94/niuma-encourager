/* Dev-only helper: rasterize public/icon.svg into build/icon.png (512x512). */
const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

app.commandLine.appendSwitch('force-device-scale-factor', '1');

app.whenReady().then(async () => {
  const svg = fs.readFileSync(
    path.join(__dirname, '..', 'public', 'icon.svg'),
    'utf8',
  );

  const win = new BrowserWindow({
    width: 512,
    height: 512,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: { paintWhenInitiallyHidden: true },
  });

  const html = `<!doctype html><html><head><style>
    html,body{margin:0;padding:0;width:512px;height:512px;background:transparent;overflow:hidden}
    svg{display:block;width:512px;height:512px}
  </style></head><body>${svg}</body></html>`;

  await win.loadURL(
    'data:text/html;charset=utf-8,' + encodeURIComponent(html),
  );
  await new Promise((resolve) => setTimeout(resolve, 500));

  const image = await win.webContents.capturePage();
  fs.mkdirSync(path.join(__dirname, '..', 'build'), { recursive: true });
  const file = path.join(__dirname, '..', 'build', 'icon.png');
  fs.writeFileSync(file, image.toPNG());
  console.log('saved', file, image.getSize());

  win.destroy();
  app.quit();
});
