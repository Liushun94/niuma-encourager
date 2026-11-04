/* Dev-only: end-to-end check against the packaged app via CDP. */
const fs = require('node:fs');
const path = require('node:path');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getTarget() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json/list');
      const targets = await res.json();
      const page = targets.find(
        (t) => t.type === 'page' && !t.url.startsWith('devtools://'),
      );
      if (page) return page;
    } catch {
      // app still starting
    }
    await wait(250);
  }
  throw new Error('CDP target not found');
}

async function main() {
  const page = await getTarget();
  console.log('target:', page.title, page.url);

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = () => reject(new Error('ws error'));
  });

  let nextId = 0;
  const pending = new Map();
  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result);
    }
  };

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) {
      throw new Error(
        result.exceptionDetails.exception?.description ||
          result.exceptionDetails.text,
      );
    }
    return result.result.value;
  };

  await send('Runtime.enable');
  await wait(800);

  const bridge = await evaluate(`Boolean(window.niuma)`);
  const setupVisible = await evaluate(`Boolean(document.querySelector('.start-btn'))`);
  console.log('preload bridge:', bridge, 'setup visible:', setupVisible);

  if (setupVisible) {
    await evaluate(`document.querySelector('.start-btn').click()`);
    await wait(900);
  }

  const state1 = await evaluate(`({
    pill: document.querySelector('.work-pill')?.textContent,
    money: document.querySelector('.money-big')?.textContent,
    stored: JSON.parse(localStorage.getItem('niuma.salary.v1') || 'null'),
    buttons: [...document.querySelectorAll('.rail-btn')].map((b) => b.innerText.replace(/\\n/g, ' / '))
  })`);
  console.log('dashboard:', state1);

  await evaluate(`document.querySelector('.rail-btn--music')?.click()`);
  await wait(600);
  console.log(
    'music:',
    await evaluate(`({
      pill: document.querySelector('.work-pill')?.textContent,
      nowPlaying: document.querySelector('.now-playing')?.innerText.replace(/\\n/g, ' / '),
      musicBtn: document.querySelector('.rail-btn--music')?.innerText.replace(/\\n/g, ' / ')
    })`),
  );

  await evaluate(`document.querySelector('.rail-btn--music')?.click()`);
  await wait(400);

  await evaluate(`document.querySelector('.rail-btn--phone')?.click()`);
  await wait(800);
  console.log(
    'phone:',
    await evaluate(`({
      pill: document.querySelector('.work-pill')?.textContent,
      statusBar: document.querySelector('.phone-status')?.innerText.replace(/\\n/g, ' / '),
      bubbles: [...document.querySelectorAll('.phone-bubble')].map((b) => b.textContent.trim()),
      phoneBtn: document.querySelector('.rail-btn--phone')?.innerText.replace(/\\n/g, ' / ')
    })`),
  );
  {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.mkdirSync(path.join(__dirname, '..', 'shots'), { recursive: true });
    fs.writeFileSync(
      path.join(__dirname, '..', 'shots', 'packaged-phone.png'),
      Buffer.from(shot.data, 'base64'),
    );
  }
  await evaluate(`document.querySelector('.rail-btn--phone')?.click()`);
  await wait(400);

  await evaluate(`document.querySelector('.rail-btn--toilet')?.click()`);
  await wait(700);
  console.log(
    'toilet:',
    await evaluate(`({
      pill: document.querySelector('.work-pill')?.textContent,
      chip: document.querySelector('.scene-chip--toilet')?.textContent,
      runner: Boolean(document.querySelector('.toilet-runner'))
    })`),
  );
  await wait(6800);
  console.log(
    'back:',
    await evaluate(`document.querySelector('.work-pill')?.textContent`),
  );

  await evaluate(`document.querySelector('.rail-btn--pie')?.click()`);
  await wait(350);
  console.log(
    'pie:',
    await evaluate(`({
      speed: document.querySelector('.speed-chip')?.textContent,
      pieBtn: document.querySelector('.rail-btn--pie')?.innerText.replace(/\\n/g, ' / '),
      pie: Boolean(document.querySelector('.pie-dream')),
      message: document.querySelector('.pie-bubble text')?.textContent
    })`),
  );
  {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(__dirname, '..', 'shots', 'packaged-pie.png'),
      Buffer.from(shot.data, 'base64'),
    );
  }
  await wait(1800);

  await evaluate(`document.querySelector('.rail-btn--whip')?.click()`);
  await wait(120);
  await evaluate(`document.querySelector('.rail-btn--whip')?.click()`);
  await wait(500);
  console.log(
    'whip:',
    await evaluate(`({
      speed: document.querySelector('.speed-chip')?.textContent,
      whipBtn: document.querySelector('.rail-btn--whip')?.innerText.replace(/\\n/g, ' / '),
      toast: document.querySelector('.scene-toast')?.textContent
    })`),
  );

  const pinOn = await evaluate(`window.niuma.togglePin()`);
  const pinOff = await evaluate(`window.niuma.togglePin()`);
  console.log('pin toggle:', pinOn, pinOff);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.mkdirSync(path.join(__dirname, '..', 'shots'), { recursive: true });
  fs.writeFileSync(
    path.join(__dirname, '..', 'shots', 'packaged-cdp.png'),
    Buffer.from(shot.data, 'base64'),
  );
  console.log('screenshot saved');

  await evaluate(`window.niuma.close()`);
  await wait(500);
  ws.close();
  console.log('closed app');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
