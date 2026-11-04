/* Dev-only helper: render the built app and save screenshots for visual QA. */
const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

app.commandLine.appendSwitch('force-device-scale-factor', '1');

const outDir = path.join(__dirname, '..', 'shots');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function capture(win, name) {
  const image = await win.webContents.capturePage();
  const file = path.join(outDir, `${name}.png`);
  fs.writeFileSync(file, image.toPNG());
  console.log('saved', file);
}

async function clickButton(win, label) {
  return win.webContents.executeJavaScript(`
    (() => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.includes(${JSON.stringify(label)}));
      if (!btn) return false;
      btn.click();
      return true;
    })()
  `);
}

async function waitForPill(win, text, timeout = 9000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    const pill = await win.webContents.executeJavaScript(
      `document.querySelector('.work-pill')?.textContent ?? ''`,
    );
    if (pill.includes(text)) return true;
    await wait(120);
  }
  console.log('timeout waiting for pill:', text);
  return false;
}

app.whenReady().then(async () => {
  fs.mkdirSync(outDir, { recursive: true });

  const win = new BrowserWindow({
    width: 1200,
    height: 820,
    x: 40,
    y: 40,
    show: true,
    frame: false,
    backgroundColor: '#f7efdf',
    webPreferences: {
      preload: path.join(__dirname, '..', 'electron', 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
    },
  });

  await win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));

  // Setup screen first (clean storage)
  await win.webContents.executeJavaScript(`localStorage.clear(); location.reload();`);
  await wait(1500);
  await capture(win, '01-setup');

  // Dashboard with a sample salary
  await win.webContents.executeJavaScript(`
    localStorage.setItem('niuma.salary.v1', JSON.stringify({
      amount: 12000, period: 'monthly', currency: 'CNY', workingHours: 8, holidayDays: 115
    }));
    location.reload();
  `);
  await wait(2400);
  await capture(win, '02-work');

  // Music mode
  await clickButton(win, '听歌');
  await waitForPill(win, '摸鱼');
  await wait(700);
  await capture(win, '03-music');

  // Phone mode
  await clickButton(win, '收工');
  await waitForPill(win, '牛马在岗');
  await wait(300);
  await clickButton(win, '玩手机');
  await waitForPill(win, '刷手机');
  await wait(900);
  await capture(win, '04-phone');

  // Toilet mode
  await clickButton(win, '收手机');
  await waitForPill(win, '牛马在岗');
  await wait(300);
  await clickButton(win, '上厕所');
  await waitForPill(win, '带薪如厕');
  await wait(250);
  await capture(win, '05-toilet-run');
  await wait(2600);
  await capture(win, '06-toilet-wait');

  // Wait until the donkey is back, then draw a pie and crack the whip
  await waitForPill(win, '牛马在岗', 9000);
  await wait(500);
  await clickButton(win, '画大饼');
  await wait(300);
  await capture(win, '07-pie-a');
  await wait(500);
  await capture(win, '08-pie-b');

  await clickButton(win, '鞭策');
  await wait(300);
  await capture(win, '09-whip');

  for (let i = 0; i < 2; i += 1) {
    await wait(250);
    await clickButton(win, '画大饼');
  }
  await wait(600);
  await capture(win, '10-boosted');

  win.destroy();
  app.quit();
});
