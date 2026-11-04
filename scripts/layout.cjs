/* Dev-only: print layout metrics of the built app. */
const { app, BrowserWindow } = require('electron');
const path = require('node:path');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 820,
    show: true,
    backgroundColor: '#f7efdf',
    webPreferences: { backgroundThrottling: false },
  });
  await win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  await win.webContents.executeJavaScript(`
    localStorage.setItem('niuma.salary.v1', JSON.stringify({amount:10000,period:'monthly',currency:'CNY',workingHours:8,holidayDays:115}));
    location.reload();
  `);
  await new Promise((r) => setTimeout(r, 1600));
  const metrics = await win.webContents.executeJavaScript(`
    (() => {
      const pick = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return { sel, top: r.top, bottom: r.bottom, height: r.height, display: s.display, marginTop: s.marginTop, marginBottom: s.marginBottom, overflow: s.overflowY };
      };
      return {
        innerHeight: window.innerHeight,
        items: ['.app', '.app-main', '.dashboard', '.dash-head', '.dash-grid', '.dash-side', '.stage-card'].map(pick)
      };
    })()
  `);
  console.log(JSON.stringify(metrics, null, 2));
  win.destroy();
  app.quit();
});
