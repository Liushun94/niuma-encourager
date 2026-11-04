import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Donkey } from './donkey/Donkey';
import { DonkeyFace } from './donkey/DonkeyFace';
import { Scenery } from './donkey/Scenery';
import {
  HeadphonesIcon,
  MusicNoteIcon,
  PhoneIcon,
  PieIcon,
  ToiletIcon,
  WhipIcon,
} from './icons';

export type SceneMode = 'work' | 'music' | 'phone' | 'toilet';

export const BASE_SPEED = 20;
export const WHIP_STEP = 6;
export const PIE_STEP = 5;
export const MAX_SPEED = 62;

const CX = 320;
const CY = 258;
const ORBIT_Y = 300;
const ORBIT_RX = 158;
const ORBIT_RY = 56;
const TOILET_SECONDS = 6;

interface StageProps {
  mode: SceneMode;
  speed: number;
  whipPulse: number;
  whips: number;
  pies: number;
  piePulse: number;
  pieMessage: string;
  laps: number;
  toast: string | null;
  onLap: () => void;
  onToggleMusic: () => void;
  onTogglePhone: () => void;
  onToilet: () => void;
  onWhip: () => void;
  onPie: () => void;
}

export function Stage({
  mode,
  speed,
  whipPulse,
  whips,
  pies,
  piePulse,
  pieMessage,
  laps,
  toast,
  onLap,
  onToggleMusic,
  onTogglePhone,
  onToilet,
  onWhip,
  onPie,
}: StageProps) {
  const angleRef = useRef(0);
  const [angle, setAngle] = useState(0);
  const speedRef = useRef(speed);
  const onLapRef = useRef(onLap);
  const [whipping, setWhipping] = useState(false);
  const [pieActive, setPieActive] = useState(false);
  const [toiletSeconds, setToiletSeconds] = useState(TOILET_SECONDS);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    onLapRef.current = onLap;
  }, [onLap]);

  useEffect(() => {
    if (mode !== 'work') return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const prev = angleRef.current;
      const next = prev + speedRef.current * dt;
      angleRef.current = next;
      if (Math.floor(next / 360) > Math.floor(prev / 360)) {
        onLapRef.current();
      }
      setAngle(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  useEffect(() => {
    if (!whipPulse) return;
    setWhipping(true);
    const timer = setTimeout(() => setWhipping(false), 1200);
    return () => clearTimeout(timer);
  }, [whipPulse]);

  useEffect(() => {
    if (!piePulse) return;
    setPieActive(true);
    const timer = setTimeout(() => setPieActive(false), 1900);
    return () => clearTimeout(timer);
  }, [piePulse]);

  useEffect(() => {
    if (mode !== 'toilet') {
      setToiletSeconds(TOILET_SECONDS);
      return;
    }
    setToiletSeconds(TOILET_SECONDS);
    const timer = setInterval(() => {
      setToiletSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [mode]);

  const stride = `${Math.max(0.3, (0.86 * BASE_SPEED) / speed)}s`;
  const multiplier = speed / BASE_SPEED;

  const captions: Record<SceneMode, { title: string; hint: string }> = {
    work: {
      title: '驴正在拉磨，胡萝卜就在眼前',
      hint:
        multiplier > 2
          ? '磨盘快冒烟了，驴的腿倒腾出了残影'
          : '抽它两下，磨得快一点',
    },
    music: {
      title: '驴戴上了耳机，暂时听不见你',
      hint: '再点一次「收工」，让它继续拉磨',
    },
    phone: {
      title: '驴在刷手机，假装没看见磨盘',
      hint: '再点一次「收手机」，让它回去拉磨',
    },
    toilet: {
      title: `驴跑去茅房了，还剩 ${toiletSeconds} 秒`,
      hint: '带薪如厕，合理合法',
    },
  };

  return (
    <section className="stage-card">
      <header className="stage-head">
        <div className="stage-title">
          <span className="stage-live-dot" />
          驴的日常
          <span className="stage-title-sub">互动区</span>
        </div>
        <div className={`speed-chip${speed > BASE_SPEED ? ' is-boosted' : ''}`}>
          磨速 <b>×{multiplier.toFixed(2)}</b>
        </div>
      </header>

      <div className="stage-body">
        <div className={`scene-wrap scene-${mode}`}>
          <svg
            viewBox="0 0 640 460"
            className="scene"
            style={{ '--stride': stride } as CSSProperties}
            role="img"
            aria-label="一只驴绕着火柴盒磨盘拉磨，头顶挂着胡萝卜"
          >
            {mode === 'work' && (
              <MillScene
                angle={angle}
                whipping={whipping}
                whipPulse={whipPulse}
                pieActive={pieActive}
                piePulse={piePulse}
                pieMessage={pieMessage}
                speed={speed}
              />
            )}
            {mode === 'music' && <MusicScene />}
            {mode === 'phone' && <PhoneScene />}
            {mode === 'toilet' && <ToiletScene />}
          </svg>

          <div className="scene-overlay">
            {mode === 'work' && (
              <div className="scene-chip">
                <span className="chip-kicker">LAP</span>
                第 {laps + 1} 圈 · 胡萝卜还差一点
              </div>
            )}
            {mode === 'music' && (
              <div className="scene-chip scene-chip--music">
                <MusicNoteIcon size={14} />
                耳朵已封锁老板的声音
              </div>
            )}
            {mode === 'phone' && (
              <div className="scene-chip scene-chip--phone">
                <PhoneIcon size={14} />
                假装在查资料 · 99+ 未读
              </div>
            )}
            {mode === 'toilet' && (
              <div className="scene-chip scene-chip--toilet">
                <ToiletIcon size={14} />
                带薪如厕 · {toiletSeconds}s
              </div>
            )}
          </div>

          {mode === 'music' && (
            <div className="now-playing">
              <div className="eq" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div>
                <div className="np-label">摸鱼 FM · 正在播放</div>
                <div className="np-song">《胡萝卜的诱惑》</div>
              </div>
            </div>
          )}

          {mode === 'phone' && (
            <div className="phone-status">
              <div className="phone-live">
                <span className="phone-live-dot" />
                短视频 · 推荐
              </div>
              <div className="phone-likes">♥ 1.2w</div>
            </div>
          )}

          {toast && <div className="scene-toast">{toast}</div>}
        </div>

        <aside className="action-rail">
          <div className="rail-label">整点活</div>

          <button
            type="button"
            className={`rail-btn rail-btn--music${mode === 'music' ? ' is-active' : ''}`}
            onClick={onToggleMusic}
            disabled={mode === 'toilet'}
          >
            <span className="rail-icon">
              <HeadphonesIcon size={18} />
            </span>
            <span className="rail-text">
              <span className="rail-title">
                {mode === 'music' ? '收工' : '听歌'}
              </span>
              <span className="rail-sub">
                {mode === 'music' ? '继续拉磨' : '摸一会儿鱼'}
              </span>
            </span>
          </button>

          <button
            type="button"
            className={`rail-btn rail-btn--phone${mode === 'phone' ? ' is-active' : ''}`}
            onClick={onTogglePhone}
            disabled={mode === 'toilet'}
          >
            <span className="rail-icon">
              <PhoneIcon size={18} />
            </span>
            <span className="rail-text">
              <span className="rail-title">
                {mode === 'phone' ? '收手机' : '玩手机'}
              </span>
              <span className="rail-sub">
                {mode === 'phone' ? '回去拉磨' : '刷一会儿'}
              </span>
            </span>
          </button>

          <button
            type="button"
            className={`rail-btn rail-btn--toilet${mode === 'toilet' ? ' is-active' : ''}`}
            onClick={onToilet}
            disabled={mode === 'toilet'}
          >
            <span className="rail-icon">
              <ToiletIcon size={18} />
            </span>
            <span className="rail-text">
              <span className="rail-title">
                {mode === 'toilet' ? '蹲着' : '上厕所'}
              </span>
              <span className="rail-sub">
                {mode === 'toilet' ? '带薪拉屎' : '去去就回'}
              </span>
            </span>
          </button>

          <button
            type="button"
            className="rail-btn rail-btn--pie"
            onClick={onPie}
            disabled={mode !== 'work' || speed >= MAX_SPEED}
          >
            <span className="rail-icon">
              <PieIcon size={18} />
            </span>
            <span className="rail-text">
              <span className="rail-title">画大饼</span>
              <span className="rail-sub">已画 {pies} 张</span>
            </span>
          </button>

          <button
            type="button"
            className="rail-btn rail-btn--whip"
            onClick={onWhip}
            disabled={mode !== 'work' || speed >= MAX_SPEED}
          >
            <span className="rail-icon">
              <WhipIcon size={20} />
            </span>
            <span className="rail-text">
              <span className="rail-title">
                {speed >= MAX_SPEED ? '已到底' : '鞭策'}
              </span>
              <span className="rail-sub">已抽 {whips * 2} 下</span>
            </span>
          </button>
        </aside>
      </div>

      <footer className="stage-foot">
        <div className="stage-note">
          <span className={`status-dot status-${mode}`} />
          <span>{captions[mode].title}</span>
        </div>
        <div className="stage-hint">{captions[mode].hint}</div>
      </footer>
    </section>
  );
}

function MillScene({
  angle,
  whipping,
  whipPulse,
  pieActive,
  piePulse,
  pieMessage,
  speed,
}: {
  angle: number;
  whipping: boolean;
  whipPulse: number;
  pieActive: boolean;
  piePulse: number;
  pieMessage: string;
  speed: number;
}) {
  const theta = (angle * Math.PI) / 180;
  const sin = Math.sin(theta);
  const depth = (sin + 1) / 2;
  const scale = 0.8 + 0.22 * depth;
  const x = CX + ORBIT_RX * Math.cos(theta);
  const y = ORBIT_Y + ORBIT_RY * sin;
  const flip = -Math.tanh(26 * sin);
  const behind = sin < 0;

  const attachX = x - 6 * scale * flip;
  const attachY = y - 56 * scale;

  const donkey = (
    <>
      <ellipse
        cx={x}
        cy={y - 2}
        rx={50 * scale}
        ry={10 * scale}
        fill="rgba(76, 58, 38, 0.16)"
      />
      <g className="orbit-ground-dust" transform={`translate(${x} ${y - 2})`}>
        <ellipse className="hoof-dust d1" rx="9" ry="4" fill="#c8b58e" />
        <ellipse className="hoof-dust d2" rx="6" ry="3" fill="#d3c2a0" />
        <ellipse className="hoof-dust d3" rx="11" ry="4" fill="#c8b58e" />
      </g>
      <g transform={`translate(${x} ${y}) scale(${scale * flip} ${scale})`}>
        <Donkey flinching={whipping} />
      </g>
    </>
  );

  const beam = (
    <g className="mill-beam">
      <line
        x1={CX}
        y1={CY - 10}
        x2={attachX}
        y2={attachY}
        stroke="#754a26"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <line
        x1={CX}
        y1={CY - 12}
        x2={attachX}
        y2={attachY - 2}
        stroke="#a06b38"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle
        cx={attachX}
        cy={attachY}
        r="5.5"
        fill="#e8b13c"
        stroke="#2e2419"
        strokeWidth="2.2"
      />
    </g>
  );

  return (
    <g>
      <Scenery />

      <ellipse
        cx={CX}
        cy={ORBIT_Y}
        rx={ORBIT_RX}
        ry={ORBIT_RY}
        fill="none"
        stroke="#c9b58c"
        strokeWidth="2.5"
        strokeDasharray="5 11"
        opacity="0.75"
      />
      <ellipse cx={CX} cy={ORBIT_Y} rx={ORBIT_RX - 9} ry={ORBIT_RY - 4} fill="none" stroke="#d6c49e" strokeWidth="1.5" opacity="0.5" />

      {behind && beam}
      {behind && donkey}

      <Millstone spin={angle * 2.4} />

      {!behind && beam}
      {!behind && donkey}

      {speed > BASE_SPEED + 2 && (
        <g className="speed-lines" opacity={Math.min((speed - BASE_SPEED) / 40 + 0.25, 0.7)}>
          <path d={`M ${x + 70 * scale} ${y - 92 * scale} h 26`} />
          <path d={`M ${x + 78 * scale} ${y - 74 * scale} h 20`} />
          <path d={`M ${x + 68 * scale} ${y - 56 * scale} h 30`} />
        </g>
      )}

      {whipping && (
        <g className="whip-fx" key={whipPulse} pointerEvents="none">
          <g transform={`translate(${x + 6} ${y - 108 * scale})`}>
            <text className="pow pow-1" textAnchor="middle" x="0" y="0">
              啪!
            </text>
            <text className="pow pow-2" textAnchor="middle" x="30" y="18">
              啪!
            </text>
            <path className="impact impact-1" d="M -34 -18 l -14 -10 M 34 -16 l 15 -8 M 0 -40 l 0 -16" />
          </g>
          <path
            className="whip-strike"
            d={`M ${x + 150} ${y - 190} C ${x + 100} ${y - 150}, ${x + 70} ${y - 130}, ${x + 30} ${y - 105}`}
          />
          <path
            className="whip-handle"
            d={`M ${x + 205} ${y - 248} L ${x + 150} ${y - 190}`}
          />
          <circle
            className="whip-knob"
            cx={x + 205}
            cy={y - 248}
            r="5.5"
          />
        </g>
      )}

      {pieActive && (
        <g
          key={piePulse}
          transform={`translate(${x} ${y - 155 * scale})`}
          pointerEvents="none"
        >
          <PieDream message={pieMessage} />
        </g>
      )}

      <g transform="translate(566 356)" opacity="0.9">
        <ellipse cx="0" cy="30" rx="26" ry="7" fill="#8f7a52" opacity="0.16" />
        <path d="M -18 0 L 18 0 L 14 30 L -14 30 Z" fill="#b98a55" stroke="#5c4529" strokeWidth="2.5" />
        <ellipse cx="0" cy="0" rx="18" ry="6" fill="#8a6136" stroke="#5c4529" strokeWidth="2.5" />
        <path d="M -16 5 C -6 12, 8 12, 17 4" fill="none" stroke="#d9c294" strokeWidth="2" opacity="0.7" />
        <path d="M -18 0 C -26 -2, -30 -10, -24 -14" fill="none" stroke="#5c4529" strokeWidth="2.5" />
      </g>
    </g>
  );
}

function Millstone({ spin }: { spin: number }) {
  const rx = 86;
  const ry = 32;
  const depth = 24;
  return (
    <g className="millstone">
      <ellipse cx={CX} cy="320" rx="128" ry="34" fill="#8b7452" opacity="0.16" />
      <ellipse cx={CX} cy={CY + depth} rx={rx} ry={ry} fill="#867c6d" stroke="#2e2419" strokeWidth="3" />
      <rect x={CX - rx} y={CY} width={rx * 2} height={depth} fill="#948a7a" />
      <path
        d={`M ${CX - rx + 3} ${CY} v ${depth} M ${CX - rx * 0.55} ${CY + 2} v ${depth - 2} M ${CX + rx * 0.5} ${CY + 2} v ${depth - 2} M ${CX + rx - 3} ${CY} v ${depth}`}
        stroke="#776d5f"
        strokeWidth="2"
        opacity="0.55"
      />
      <ellipse cx={CX} cy={CY + depth} rx={rx} ry={ry} fill="none" stroke="#2e2419" strokeWidth="3" />
      <ellipse cx={CX} cy={CY} rx={rx} ry={ry} fill="#bab2a4" stroke="#2e2419" strokeWidth="3.4" />

      <clipPath id="mill-top-clip">
        <ellipse cx={CX} cy={CY} rx={rx - 2} ry={ry - 1.5} />
      </clipPath>
      <g clipPath="url(#mill-top-clip)">
        <g transform={`rotate(${spin} ${CX} ${CY})`}>
          <ellipse cx={CX} cy={CY - 6} rx={rx - 14} ry={ry - 7} fill="none" stroke="#a69c8d" strokeWidth="2.5" />
          <ellipse cx={CX} cy={CY + 4} rx={rx - 30} ry={ry - 10} fill="none" stroke="#a69c8d" strokeWidth="2" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <line
                key={i}
                x1={CX + Math.cos(a) * 18}
                y1={CY + Math.sin(a) * 7}
                x2={CX + Math.cos(a) * (rx - 8)}
                y2={CY + Math.sin(a) * (ry - 4)}
                stroke="#a1988a"
                strokeWidth="2"
                opacity="0.8"
              />
            );
          })}
          <circle cx={CX - 48} cy={CY - 12} r="3.5" fill="#9d9385" />
          <circle cx={CX + 38} cy={CY + 9} r="4.5" fill="#9d9385" />
          <circle cx={CX + 20} cy={CY - 18} r="2.6" fill="#9d9385" />
          <circle cx={CX - 58} cy={CY + 8} r="2.4" fill="#9d9385" />
        </g>
      </g>

      <ellipse cx={CX} cy={CY} rx="13" ry="6" fill="#6b5a45" stroke="#2e2419" strokeWidth="2.4" />
      <circle cx={CX} cy={CY - 4} r="6" fill="#d2a154" stroke="#2e2419" strokeWidth="2.2" />
      <circle cx={CX - 26} cy={CY + 18} r="4" fill="#c6bda9" stroke="#8d8272" strokeWidth="1.5" />
      <circle cx={CX + 34} cy={CY + 4} r="3" fill="#c6bda9" stroke="#8d8272" strokeWidth="1.5" />
    </g>
  );
}

function PieDream({ message }: { message: string }) {
  const bubbleWidth = Math.max(124, message.length * 14 + 30);

  return (
    <g className="pie-dream">
      <circle
        className="pie-halo"
        cx="0"
        cy="0"
        r="44"
        fill="none"
        stroke="#e8b15c"
        strokeWidth="2"
        strokeDasharray="4 9"
      />

      <g className="pie-body">
        <ellipse cx="0" cy="29" rx="30" ry="8" fill="rgba(70, 50, 30, 0.16)" />
        <circle cx="0" cy="0" r="30" fill="#edb867" stroke="#2e2419" strokeWidth="3" />
        <circle cx="0" cy="-2" r="21" fill="#f6ce88" stroke="#d69a45" strokeWidth="2" />
        <path
          d="M -24 -13 A 27 27 0 0 1 24 -13"
          fill="none"
          stroke="#d69a45"
          strokeWidth="2"
          opacity="0.7"
        />
        <path
          d="M -26 4 A 27 27 0 0 0 26 4"
          fill="none"
          stroke="#d69a45"
          strokeWidth="2"
          opacity="0.4"
        />
        <g fill="#2e2419">
          <circle cx="-8" cy="-6" r="2.2" />
          <circle cx="8" cy="-6" r="2.2" />
        </g>
        <path
          d="M -8 4 Q 0 12 8 4"
          fill="none"
          stroke="#2e2419"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <g fill="#c98a3a" opacity="0.8">
          <circle cx="-16" cy="10" r="1.8" />
          <circle cx="15" cy="12" r="1.6" />
          <circle cx="2" cy="19" r="1.5" />
        </g>
        <g
          className="pie-steam"
          stroke="#f8e2b8"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        >
          <path d="M -9 -36 C -14 -43, -5 -47, -9 -56" />
          <path d="M 9 -37 C 13 -44, 5 -49, 9 -58" />
        </g>
        <g className="pie-slice" transform="translate(35 -18) rotate(14)">
          <path
            d="M 0 0 L 16 -7 L 12 9 Z"
            fill="#f6ce88"
            stroke="#2e2419"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </g>
      </g>

      <g className="pie-sparkles" fill="#e8a23e">
        <path
          className="spark-1"
          d="M -47 -20 l 2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z"
        />
        <path
          className="spark-2"
          d="M 44 -36 l 2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"
        />
        <path
          className="spark-3"
          d="M 42 22 l 1.8 4.5 4.5 1.8 -4.5 1.8 -1.8 4.5 -1.8 -4.5 -4.5 -1.8 4.5 -1.8z"
        />
      </g>

      <g className="pie-bubble" transform="translate(0 -88)">
        <rect
          x={-bubbleWidth / 2}
          y="-19"
          width={bubbleWidth}
          height="34"
          rx="13"
          fill="#fffcf5"
          stroke="#2e2419"
          strokeWidth="2.4"
        />
        <path
          d="M -7 15 L 0 26 L 8 14"
          fill="#fffcf5"
          stroke="#2e2419"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M -6 16 L 8 16" stroke="#fffcf5" strokeWidth="3" />
        <text
          x="0"
          y="3"
          textAnchor="middle"
          fontSize="12.5"
          fontWeight="700"
          fill="#2e2419"
          fontFamily="inherit"
        >
          {message}
        </text>
      </g>
    </g>
  );
}

function MusicScene() {
  return (
    <g>
      <Scenery />
      <circle cx="320" cy="250" r="196" fill="#f6e7c9" opacity="0.8" />
      <circle
        cx="320"
        cy="250"
        r="214"
        fill="none"
        stroke="#d7c29a"
        strokeWidth="2"
        strokeDasharray="3 12"
      />
      <g className="music-halo" fill="none" stroke="#e2c99b" strokeWidth="2" opacity="0.7">
        <circle cx="320" cy="250" r="150" />
        <circle cx="320" cy="250" r="116" strokeDasharray="4 8" />
      </g>

      <g transform="translate(120 38)">
        <g className="music-face">
          <DonkeyFace headphones />
        </g>
      </g>

      <g className="music-notes">
        <g transform="translate(120 168)">
          <g className="music-note note-a">
            <path d="M 0 0 L 0 -54" stroke="#3f5c43" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="-8" cy="2" rx="11" ry="7.5" fill="#3f5c43" transform="rotate(-18 -8 2)" />
            <path d="M 0 -54 C 20 -52, 24 -36, 16 -24" fill="none" stroke="#3f5c43" strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>
        <g transform="translate(526 208)">
          <g className="music-note note-b">
            <path d="M 0 0 L 0 -44 M 26 8 L 26 -36" stroke="#c96a17" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 0 -44 L 26 -36" stroke="#c96a17" strokeWidth="4.5" strokeLinecap="round" />
            <ellipse cx="-8" cy="3" rx="10" ry="7" fill="#e8892e" transform="rotate(-18 -8 3)" />
            <ellipse cx="18" cy="11" rx="10" ry="7" fill="#e8892e" transform="rotate(-18 18 11)" />
          </g>
        </g>
        <g transform="translate(492 356)">
          <g className="music-note note-c">
            <path d="M 0 0 L 0 -36" stroke="#4b6a7a" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="-7" cy="2" rx="9" ry="6" fill="#4b6a7a" transform="rotate(-18 -7 2)" />
            <path d="M 0 -36 C 14 -35, 17 -24, 11 -16" fill="none" stroke="#4b6a7a" strokeWidth="4" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </g>
  );
}

function PhoneScene() {
  return (
    <g>
      <defs>
        <linearGradient id="phoneGlare" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.36" />
          <stop offset="52%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="phone-screen-clip">
          <rect x="275" y="303" width="90" height="142" rx="11" />
        </clipPath>
      </defs>

      <Scenery />
      <circle cx="320" cy="250" r="196" fill="#f6e7c9" opacity="0.8" />
      <circle
        cx="320"
        cy="250"
        r="214"
        fill="none"
        stroke="#d7c29a"
        strokeWidth="2"
        strokeDasharray="3 12"
      />
      <g
        className="phone-halo"
        fill="none"
        stroke="#e2c99b"
        strokeWidth="2"
        opacity="0.65"
      >
        <circle cx="320" cy="250" r="152" />
        <circle cx="320" cy="250" r="118" strokeDasharray="4 8" />
      </g>

      <g transform="translate(120 16)">
        <DonkeyFace expression="phone" />
      </g>

      {/* 屏幕光 */}
      <ellipse cx="320" cy="352" rx="122" ry="88" fill="#ffe4a3" opacity="0.22" />
      <ellipse cx="320" cy="320" rx="80" ry="100" fill="#fff1c8" opacity="0.16" />

      {/* 手机 */}
      <g className="held-phone" transform="rotate(-2 320 380)">
        <rect
          x="266"
          y="294"
          width="108"
          height="160"
          rx="18"
          fill="#2e2419"
          stroke="#2e2419"
          strokeWidth="3"
        />
        <rect x="275" y="303" width="90" height="142" rx="11" fill="#eef4ef" />

        <g clipPath="url(#phone-screen-clip)">
          <rect x="275" y="303" width="90" height="142" fill="#eef4ef" />
          <g className="phone-feed">
            <rect x="275" y="303" width="90" height="22" fill="#fffdf6" />
            <text
              x="320"
              y="318"
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="700"
              fill="#2e2419"
              fontFamily="inherit"
            >
              推荐
            </text>
            <rect
              x="281"
              y="330"
              width="78"
              height="64"
              rx="6"
              fill="#cfe0d8"
              stroke="#2e2419"
              strokeWidth="1.6"
            />
            <circle cx="300" cy="347" r="6" fill="#f2b95c" />
            <path
              d="M 281 386 C 296 370, 310 379, 322 366 C 334 353, 348 363, 359 351 L 359 394 L 281 394 Z"
              fill="#9dbfa5"
            />
            <circle
              cx="331"
              cy="371"
              r="10"
              fill="#a9998a"
              stroke="#2e2419"
              strokeWidth="1.4"
            />
            <path
              d="M 324 364 L 321 356 M 338 364 L 341 356"
              stroke="#2e2419"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="327" cy="371" r="1.2" fill="#2e2419" />
            <circle cx="335" cy="371" r="1.2" fill="#2e2419" />
            <path
              d="M 328 376 Q 331 378 334 376"
              fill="none"
              stroke="#2e2419"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <g className="phone-heart">
              <path
                d="M 349 377 c -5 -5, -11 0, -6 6 l 6 6 l 6 -6 c 5 -6, -1 -11, -6 -6 z"
                fill="#c9503c"
              />
            </g>
            <text
              x="349"
              y="396"
              textAnchor="middle"
              fontSize="6.5"
              fill="#756855"
              fontFamily="inherit"
            >
              1.2w
            </text>
            <rect x="281" y="402" width="56" height="4" rx="2" fill="#c9c3b6" />
            <rect x="281" y="411" width="42" height="4" rx="2" fill="#d9d3c6" />
            <rect x="281" y="424" width="78" height="16" rx="5" fill="#e6dfd1" />
          </g>
          <rect
            x="275"
            y="303"
            width="90"
            height="142"
            fill="url(#phoneGlare)"
          />
        </g>

        <rect x="302" y="307" width="36" height="6" rx="3" fill="#2e2419" opacity="0.75" />

        {/* 蹄子举着手机 */}
        <ellipse
          cx="261"
          cy="414"
          rx="12"
          ry="20"
          transform="rotate(16 261 414)"
          fill="#a9998a"
          stroke="#2e2419"
          strokeWidth="3"
        />
        <ellipse
          cx="379"
          cy="414"
          rx="12"
          ry="20"
          transform="rotate(-16 379 414)"
          fill="#a9998a"
          stroke="#2e2419"
          strokeWidth="3"
        />
        <rect
          x="253"
          y="422"
          width="16"
          height="7"
          rx="3"
          fill="#4a3b2e"
          transform="rotate(16 253 422)"
        />
        <rect
          x="371"
          y="422"
          width="16"
          height="7"
          rx="3"
          fill="#4a3b2e"
          transform="rotate(-16 371 422)"
        />
        <rect x="303" y="441" width="34" height="3.5" rx="1.75" fill="#756855" opacity="0.5" />
      </g>

      {/* 消息气泡 */}
      <g transform="translate(86 134)">
        <g className="phone-bubble phone-bubble--boss">
          <rect x="0" y="0" width="152" height="40" rx="14" fill="#fffcf5" stroke="#2e2419" strokeWidth="2.4" />
          <path d="M 36 40 L 25 53 L 52 40 Z" fill="#fffcf5" stroke="#2e2419" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M 36 41 L 51 41" stroke="#fffcf5" strokeWidth="3" />
          <text x="76" y="25" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2e2419" fontFamily="inherit">
            老板：在吗？
          </text>
        </g>
      </g>

      <g transform="translate(438 120)">
        <g className="phone-bubble phone-bubble--unread">
          <rect x="0" y="0" width="126" height="36" rx="13" fill="#fdf0da" stroke="#2e2419" strokeWidth="2.4" />
          <path d="M 30 36 L 20 48 L 45 36 Z" fill="#fdf0da" stroke="#2e2419" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M 29 37 L 44 37" stroke="#fdf0da" strokeWidth="3" />
          <text x="63" y="23" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#c96a17" fontFamily="inherit">
            99+ 条未读
          </text>
        </g>
      </g>

      {/* 漂浮的小红心 */}
      <g fill="#c9503c" opacity="0.7">
        <g transform="translate(236 182)">
          <path
            className="phone-heart-float heart-a"
            d="M 0 0 c -5 -5, -12 0, -6 7 l 6 6 l 6 -6 c 6 -7, -1 -12, -6 -7 z"
          />
        </g>
        <g transform="translate(414 250)">
          <path
            className="phone-heart-float heart-b"
            d="M 0 0 c -4 -4, -10 0, -5 6 l 5 5 l 5 -5 c 5 -6, -1 -10, -5 -6 z"
          />
        </g>
        <g transform="translate(206 310)">
          <path
            className="phone-heart-float heart-c"
            d="M 0 0 c -4 -4, -10 0, -5 6 l 5 5 l 5 -5 c 5 -6, -1 -10, -5 -6 z"
          />
        </g>
      </g>
    </g>
  );
}

function ToiletScene() {
  return (
    <g>
      <Scenery />

      {/* 栅栏 */}
      <g stroke="#8a6136" strokeWidth="5" strokeLinecap="round" opacity="0.8">
        <path d="M 398 330 v 52" />
        <path d="M 424 336 v 46" />
        <path d="M 398 344 h 26" />
        <path d="M 398 362 h 26" />
      </g>

      {/* 跑向茅房的驴 */}
      <g transform="translate(466 386) scale(0.72)">
        <g className="toilet-runner" style={{ '--stride': '0.26s' } as CSSProperties}>
          <ellipse cx="0" cy="3" rx="50" ry="9" fill="rgba(76, 58, 38, 0.16)" />
          <Donkey />
        </g>
      </g>

      {/* 茅房（画在驴之后，驴跑进去时会被房子挡住） */}
      <g className="outhouse">
        <ellipse cx="548" cy="394" rx="86" ry="16" fill="#8f7a52" opacity="0.18" />
        <rect x="486" y="238" width="124" height="152" rx="4" fill="#b98a55" stroke="#2e2419" strokeWidth="4" />
        <path
          d="M 496 244 v 140 M 514 244 v 140 M 532 244 v 140 M 550 244 v 140 M 568 244 v 140 M 586 244 v 140 M 604 244 v 140"
          stroke="#a17545"
          strokeWidth="2"
          opacity="0.7"
        />
        <path d="M 464 242 L 548 194 L 632 242 Z" fill="#8a5a37" stroke="#2e2419" strokeWidth="4" strokeLinejoin="round" />
        <path d="M 484 234 L 548 198 L 612 234" fill="none" stroke="#a97a4b" strokeWidth="3" opacity="0.8" />
        <rect x="516" y="272" width="66" height="118" rx="3" fill="#8a5f3a" stroke="#2e2419" strokeWidth="3.5" />
        <rect x="524" y="282" width="50" height="46" rx="2" fill="#9c7048" stroke="#6b4526" strokeWidth="2" />
        <circle cx="534" cy="332" r="3" fill="#2e2419" />
        <circle cx="562" cy="304" r="10" fill="#f2dcaa" />
        <circle cx="567" cy="300" r="8" fill="#8a5f3a" />
        <rect x="530" y="248" width="48" height="18" rx="4" fill="#3f5c43" stroke="#2e2419" strokeWidth="2.5" />
        <text x="554" y="261" textAnchor="middle" fontSize="12" fontWeight="700" fill="#f7efdf" fontFamily="inherit">
          茅房
        </text>
        <path d="M 486 376 h 124" stroke="#7a5533" strokeWidth="3" opacity="0.7" />
        <g fill="#3f5c43" opacity="0.8">
          <ellipse cx="476" cy="382" rx="9" ry="4" />
          <ellipse cx="620" cy="384" rx="11" ry="5" />
        </g>
      </g>

      {/* 扬起的灰尘 */}
      <g fill="#cdbb95">
        <ellipse className="run-dust dust-run-1" cx="356" cy="372" rx="9" ry="4" />
        <ellipse className="run-dust dust-run-2" cx="400" cy="380" rx="11" ry="5" />
        <ellipse className="run-dust dust-run-3" cx="438" cy="370" rx="7" ry="3" />
      </g>

      <g className="loo-bubble">
        <rect
          x="494"
          y="138"
          width="108"
          height="44"
          rx="16"
          fill="#fffcf5"
          stroke="#2e2419"
          strokeWidth="2.5"
        />
        <path
          d="M 534 180 L 548 194 L 562 180 Z"
          fill="#fffcf5"
          stroke="#2e2419"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M 534 181 L 562 181" stroke="#fffcf5" strokeWidth="3" />
        <g fill="#756855">
          <circle cx="524" cy="160" r="4" />
          <circle cx="548" cy="160" r="4" />
          <circle cx="572" cy="160" r="4" />
        </g>
      </g>
    </g>
  );
}
