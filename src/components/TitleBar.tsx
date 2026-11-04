import { useState } from 'react';
import { CloseIcon, MinimizeIcon, PinIcon } from './icons';

export function TitleBar() {
  const [pinned, setPinned] = useState(false);
  const inElectron = typeof window !== 'undefined' && Boolean(window.niuma);

  return (
    <header className="titlebar">
      <div className="titlebar-brand">
        <img src="./icon.svg" alt="" className="brand-icon" draggable={false} />
        <span className="brand-name">牛马鼓励器</span>
        <span className="brand-tag">NIUMA · v1.0</span>
      </div>

      <div className="titlebar-drag" />

      {inElectron ? (
        <div className="window-controls">
          <button
            type="button"
            className={`win-btn${pinned ? ' is-on' : ''}`}
            title={pinned ? '取消置顶' : '窗口置顶'}
            aria-label={pinned ? '取消置顶' : '窗口置顶'}
            onClick={async () => {
              const next = await window.niuma?.togglePin();
              setPinned(Boolean(next));
            }}
          >
            <PinIcon size={16} />
          </button>
          <button
            type="button"
            className="win-btn"
            title="最小化"
            aria-label="最小化"
            onClick={() => window.niuma?.minimize()}
          >
            <MinimizeIcon size={16} />
          </button>
          <button
            type="button"
            className="win-btn win-btn--close"
            title="关闭"
            aria-label="关闭"
            onClick={() => window.niuma?.close()}
          >
            <CloseIcon size={16} />
          </button>
        </div>
      ) : (
        <div className="titlebar-web">网页预览 · 打包后即为桌面应用</div>
      )}
    </header>
  );
}
