import { useState } from 'react';
import type { FormEvent } from 'react';
import { DonkeyFace } from './donkey/DonkeyFace';
import { ArrowRightIcon } from './icons';
import {
  currencyNames,
  currencySymbols,
  periodLabels,
  salaryPresets,
  SalaryData,
  Period,
} from '../types';

interface SetupScreenProps {
  initial: SalaryData | null;
  onStart: (data: SalaryData) => void;
}

type HolidayMode = '115' | '0' | 'custom';

const periods: Period[] = ['yearly', 'monthly', 'weekly', 'hourly'];

export function SetupScreen({ initial, onStart }: SetupScreenProps) {
  const [amount, setAmount] = useState(
    initial ? String(initial.amount) : '10000',
  );
  const [period, setPeriod] = useState<Period>(initial?.period ?? 'monthly');
  const [currency, setCurrency] = useState(initial?.currency ?? 'CNY');
  const [hours, setHours] = useState(
    initial ? String(initial.workingHours) : '8',
  );
  const [holidayMode, setHolidayMode] = useState<HolidayMode>(() => {
    const days = initial?.holidayDays;
    if (days === 0) return '0';
    if (days && days !== 115) return 'custom';
    return '115';
  });
  const [customHolidays, setCustomHolidays] = useState(
    initial && initial.holidayDays !== 0 && initial.holidayDays !== 115
      ? String(initial.holidayDays)
      : '',
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (key: string) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    const amountNum = Number(amount);
    const hoursNum = Number(hours);

    if (!amount.trim() || !Number.isFinite(amountNum) || amountNum <= 0) {
      nextErrors.amount = '请输入一个大于 0 的金额';
    }
    if (
      !hours.trim() ||
      !Number.isFinite(hoursNum) ||
      hoursNum <= 0 ||
      hoursNum > 24
    ) {
      nextErrors.hours = '每天工时需在 1–24 小时之间';
    }

    let holidayDays = 0;
    if (holidayMode === '115') {
      holidayDays = 115;
    } else if (holidayMode === 'custom') {
      const customNum = Number(customHolidays);
      if (
        !customHolidays.trim() ||
        !Number.isFinite(customNum) ||
        customNum < 0 ||
        customNum > 365
      ) {
        nextErrors.holidays = '请输入 0–365 之间的天数';
      } else {
        holidayDays = Math.round(customNum);
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onStart({
      amount: amountNum,
      period,
      currency,
      workingHours: hoursNum,
      holidayDays,
    });
  }

  return (
    <div className="setup">
      <section className="setup-hero">
        <div>
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            实时工资 · 拉磨可视化
          </div>
          <h1 className="hero-title">
            牛马
            <br />
            <em>鼓励器</em>
          </h1>
          <p className="hero-desc">
            把每一个打工的瞬间，换算成看得见的钢镚儿。
            <br />
            再让一头驴，替你跑完这场马拉松。
          </p>
        </div>

        <div className="hero-illustration">
          <div className="hero-circle">
            <svg viewBox="0 0 400 400" aria-hidden="true">
              <DonkeyFace />
            </svg>
          </div>
          <div className="hero-badge hero-badge--1">
            胡萝卜：前方 50cm
          </div>
          <div className="hero-badge hero-badge--2">
            今日已磨：0 圈
          </div>
        </div>

        <blockquote className="hero-quote">
          “磨盘不会骗人，它真的在转。”
        </blockquote>
      </section>

      <section className="setup-card">
        <header className="form-head">
          <div>
            <h2>开工登记</h2>
            <p>告诉磨盘，你今天值多少钱。</p>
          </div>
          <span className="form-stamp">牛马专用</span>
        </header>

        <form className="salary-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <div className="field-top">
              <label htmlFor="amount">薪资金额</label>
              <span className="field-hint">{periodLabels[period]}</span>
            </div>
            <div className={`amount-input${errors.amount ? ' has-error' : ''}`}>
              <span className="amount-symbol">{currencySymbols[currency]}</span>
              <input
                id="amount"
                type="number"
                min="1"
                step="any"
                inputMode="decimal"
                placeholder="例如 10000"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  clearError('amount');
                }}
              />
            </div>
            {errors.amount && <p className="field-error">{errors.amount}</p>}
            <div className="preset-row">
              {salaryPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="preset-chip"
                  onClick={() => {
                    setAmount(String(preset.amount));
                    setPeriod(preset.period);
                    clearError('amount');
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>计算周期</label>
            <div className="segmented">
              {periods.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={period === item ? 'is-active' : ''}
                  onClick={() => setPeriod(item)}
                >
                  {periodLabels[item]}
                </button>
              ))}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="currency">货币</label>
              <div className="select-wrap">
                <select
                  id="currency"
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                >
                  {Object.keys(currencyNames).map((code) => (
                    <option key={code} value={code}>
                      {currencyNames[code]} {currencySymbols[code]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="hours">每天工时</label>
              <div className={`suffix-input${errors.hours ? ' has-error' : ''}`}>
                <input
                  id="hours"
                  type="number"
                  min="1"
                  max="24"
                  step="0.5"
                  inputMode="decimal"
                  value={hours}
                  onChange={(event) => {
                    setHours(event.target.value);
                    clearError('hours');
                  }}
                />
                <span>小时</span>
              </div>
              {errors.hours && <p className="field-error">{errors.hours}</p>}
            </div>
          </div>

          <div className="field">
            <label>节假日</label>
            <div className="segmented segmented--holiday">
              <button
                type="button"
                className={holidayMode === '115' ? 'is-active' : ''}
                onClick={() => {
                  setHolidayMode('115');
                  clearError('holidays');
                }}
              >
                标准 115 天
              </button>
              <button
                type="button"
                className={holidayMode === '0' ? 'is-active' : ''}
                onClick={() => {
                  setHolidayMode('0');
                  clearError('holidays');
                }}
              >
                全年无休
              </button>
              <button
                type="button"
                className={holidayMode === 'custom' ? 'is-active' : ''}
                onClick={() => setHolidayMode('custom')}
              >
                自定义
              </button>
            </div>
            {holidayMode === 'custom' && (
              <div className="custom-holiday">
                <input
                  type="number"
                  min="0"
                  max="365"
                  placeholder="每年休息多少天"
                  value={customHolidays}
                  onChange={(event) => {
                    setCustomHolidays(event.target.value);
                    clearError('holidays');
                  }}
                />
              </div>
            )}
            {errors.holidays && <p className="field-error">{errors.holidays}</p>}
          </div>

          <button type="submit" className="start-btn">
            套上磨，开转
            <ArrowRightIcon size={20} />
          </button>

          <p className="form-footnote">
            工资按秒计算 · 数据只存在本地 · 没有老板会看到
          </p>
        </form>
      </section>
    </div>
  );
}
