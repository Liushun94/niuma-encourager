import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SalaryData, quotes } from '../types';
import {
  annualIncome,
  dailyTarget,
  earningsFor,
  earningsPerSecond,
  formatMoney,
  formatNumber,
  formatRate,
  formatTime,
  greeting,
} from '../utils';
import { periodLabels, currencySymbols } from '../types';
import { BASE_SPEED, MAX_SPEED, PIE_STEP, WHIP_STEP, Stage } from './Stage';
import type { SceneMode } from './Stage';
import { ClockIcon, CoinsIcon, ResetIcon } from './icons';

interface DashboardProps {
  salary: SalaryData;
  onReset: () => void;
}

const whipMessages = [
  '啪！驴的磨速又快了',
  '啪！胡萝卜香不香？',
  '啪！这一下是替老板抽的',
  '啪！再快一点，工资在追你',
  '啪！牛马的自我修养',
];

const pieMessages = [
  '明年给你涨薪',
  '公司上市分你期权',
  '好好干，不会亏待你',
  '这季度辛苦一下',
  '我们是一家人',
  '未来可期',
  '下一个核心就是你',
  '再坚持坚持',
];

export function Dashboard({ salary, onReset }: DashboardProps) {
  const startRef = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [mode, setMode] = useState<SceneMode>('work');
  const [speed, setSpeed] = useState(BASE_SPEED);
  const [whips, setWhips] = useState(0);
  const [pies, setPies] = useState(0);
  const [laps, setLaps] = useState(0);
  const [whipPulse, setWhipPulse] = useState(0);
  const [piePulse, setPiePulse] = useState(0);
  const [pieMessage, setPieMessage] = useState(pieMessages[0]);
  const [toast, setToast] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * quotes.length),
  );
  const toastTimer = useRef<number | null>(null);

  const perSecond = useMemo(() => earningsPerSecond(salary), [salary]);
  const daily = useMemo(() => dailyTarget(salary), [salary]);
  const annual = useMemo(() => annualIncome(salary), [salary]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed((Date.now() - startRef.current) / 1000);
    }, 100);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((index) => (index + 1) % quotes.length);
    }, 9000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((text: string) => {
    setToast(text);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const handleWhip = useCallback(() => {
    if (mode !== 'work') return;
    if (speed >= MAX_SPEED) {
      showToast('驴已经跑出残影了，让它喘口气');
      setWhipPulse((pulse) => pulse + 1);
      return;
    }
    setSpeed((current) => Math.min(MAX_SPEED, current + WHIP_STEP));
    setWhips((count) => count + 1);
    setWhipPulse((pulse) => pulse + 1);
    showToast(whipMessages[Math.floor(Math.random() * whipMessages.length)]);
  }, [mode, speed, showToast]);

  const handleToggleMusic = useCallback(() => {
    if (mode === 'toilet') return;
    if (mode === 'music') {
      setMode('work');
      showToast('驴把耳机摘了，继续拉磨');
    } else {
      setMode('music');
      showToast('驴戴上了耳机：摸鱼也是工作的一部分');
    }
  }, [mode, showToast]);

  const handleTogglePhone = useCallback(() => {
    if (mode === 'toilet') return;
    if (mode === 'phone') {
      setMode('work');
      showToast('驴收起手机，假装无事发生');
    } else {
      setMode('phone');
      showToast('驴掏出手机：只刷五分钟');
    }
  }, [mode, showToast]);

  const handlePie = useCallback(() => {
    if (mode !== 'work') return;
    if (speed >= MAX_SPEED) {
      showToast('饼已经画到月球了，让驴歇会儿');
      return;
    }
    const message = pieMessages[Math.floor(Math.random() * pieMessages.length)];
    setSpeed((current) => Math.min(MAX_SPEED, current + PIE_STEP));
    setPies((count) => count + 1);
    setPieMessage(message);
    setPiePulse((pulse) => pulse + 1);
    setToast(null);
  }, [mode, speed, showToast]);

  const handleToilet = useCallback(() => {
    if (mode === 'toilet') return;
    setMode('toilet');
    showToast('驴冲向茅房：带薪如厕 5 分钟');
  }, [mode, showToast]);

  useEffect(() => {
    if (mode !== 'toilet') return;
    const timer = window.setTimeout(() => {
      setMode('work');
      showToast('驴神清气爽地回来了');
    }, 6600);
    return () => window.clearTimeout(timer);
  }, [mode, showToast]);

  const handleLap = useCallback(() => {
    setLaps((count) => count + 1);
  }, []);

  const earnings = useMemo(
    () => earningsFor(salary, elapsed),
    [salary, elapsed],
  );
  const progress = daily > 0 ? (earnings / daily) * 100 : 0;
  const dateLabel = useMemo(
    () =>
      new Date().toLocaleDateString('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }),
    [],
  );

  return (
    <div className="dashboard">
      <header className="dash-head">
        <div>
          <div className="dash-kicker">
            {dateLabel} · 宜拉磨
          </div>
          <h1>
            {greeting()}
            <span className="dash-sub"> · 磨盘已经热好了</span>
          </h1>
        </div>
        <div className="dash-head-right">
          <div className="work-pill">
            <span className={`status-dot status-${mode}`} />
            {mode === 'work'
              ? '牛马在岗'
              : mode === 'music'
                ? '摸鱼中'
                : mode === 'phone'
                  ? '刷手机中'
                  : '带薪如厕'}
          </div>
          <button type="button" className="ghost-btn" onClick={onReset}>
            <ResetIcon size={15} />
            重新设置
          </button>
        </div>
      </header>

      <div className="dash-grid">
        <div className="dash-side">
          <section className="receipt">
            <div className="receipt-top">
              <span>本次已磨出</span>
              <CoinsIcon size={17} />
            </div>
            <div className="money-big tabular">
              {formatMoney(earnings, salary.currency)}
            </div>
            <div className="money-rate">
              每秒进账{' '}
              <b className="tabular">{formatRate(perSecond, salary.currency)}</b>
              <span className="money-rate-dot">·</span>
              今日目标{' '}
              <span className="tabular">{formatMoney(daily, salary.currency)}</span>
            </div>

            <div className="receipt-dash" />

            <div className="goal-row">
              <span>今日回本进度</span>
              <b>
                {progress >= 1000
                  ? '999%+'
                  : `${Math.min(progress, 999).toFixed(progress < 1 ? 2 : 1)}%`}
              </b>
            </div>
            <div className="goal-bar">
              <div style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <div className="goal-meta">
              <span>
                {progress >= 100
                  ? '今天已经回本，剩下的都是赚的'
                  : '再磨一会儿，马上就到饭点'}
              </span>
              <span className="goal-tag">
                {periodLabels[salary.period]}
                {currencySymbols[salary.currency]}
                {formatNumber(salary.amount)}
              </span>
            </div>
          </section>

          <section className="stats-grid">
            <div className="stat">
              <span>
                <ClockIcon size={11} /> 已工作
              </span>
              <b className="tabular">{formatTime(elapsed)}</b>
            </div>
            <div className="stat">
              <span>已拉磨</span>
              <b className="tabular">{laps} 圈</b>
            </div>
            <div className="stat">
              <span>已鞭策</span>
              <b className="tabular">{whips} 次</b>
            </div>
            <div className="stat is-accent">
              <span>磨速</span>
              <b className="tabular">×{(speed / BASE_SPEED).toFixed(2)}</b>
            </div>
          </section>

          <section className="salary-card">
            <div className="salary-row">
              <span>薪资</span>
              <b>
                {periodLabels[salary.period]}{' '}
                {formatMoney(salary.amount, salary.currency, 0)}
              </b>
            </div>
            <div className="salary-row">
              <span>工时</span>
              <b>{salary.workingHours} 小时 / 天</b>
            </div>
            <div className="salary-row">
              <span>节假日</span>
              <b>{salary.holidayDays} 天 / 年</b>
            </div>
            <div className="salary-row">
              <span>年化总包</span>
              <b>{formatMoney(annual, salary.currency, 0)}</b>
            </div>
          </section>

          <section className="quote-card">
            <span className="quote-mark">“</span>
            <p key={quoteIndex}>{quotes[quoteIndex]}</p>
            <span className="quote-stamp">牛马语录 · 每 9 秒换一句</span>
          </section>
        </div>

        <div className="dash-main">
          <Stage
            mode={mode}
            speed={speed}
            whipPulse={whipPulse}
            whips={whips}
            pies={pies}
            piePulse={piePulse}
            pieMessage={pieMessage}
            laps={laps}
            toast={toast}
            onLap={handleLap}
            onToggleMusic={handleToggleMusic}
            onTogglePhone={handleTogglePhone}
            onToilet={handleToilet}
            onWhip={handleWhip}
            onPie={handlePie}
          />
        </div>
      </div>
    </div>
  );
}
