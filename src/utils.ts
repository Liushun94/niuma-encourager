import { Decimal } from 'decimal.js';
import { currencySymbols, Period, SalaryData } from './types';

/** 一年按实际工作日折算的秒数（工作时间内） */
export function periodSeconds(
  period: Period,
  workingHours: number,
  holidayDays: number,
): number {
  const workDaysPerYear = Math.max(365 - holidayDays, 1);
  switch (period) {
    case 'yearly':
      return workDaysPerYear * workingHours * 3600;
    case 'monthly':
      return (workDaysPerYear / 12) * workingHours * 3600;
    case 'weekly':
      return (workDaysPerYear / 52) * workingHours * 3600;
    case 'hourly':
      return 3600;
  }
}

export function earningsPerSecond(data: SalaryData): number {
  const total = periodSeconds(data.period, data.workingHours, data.holidayDays);
  return new Decimal(data.amount).dividedBy(total).toNumber();
}

export function earningsFor(data: SalaryData, seconds: number): number {
  return new Decimal(earningsPerSecond(data)).times(seconds).toNumber();
}

/** 一天应拿到的工钱，用来做进度条 */
export function dailyTarget(data: SalaryData): number {
  const workDaysPerYear = Math.max(365 - data.holidayDays, 1);
  switch (data.period) {
    case 'yearly':
      return data.amount / workDaysPerYear;
    case 'monthly':
      return data.amount / (workDaysPerYear / 12);
    case 'weekly':
      return data.amount / (workDaysPerYear / 52);
    case 'hourly':
      return data.amount * data.workingHours;
  }
}

export function annualIncome(data: SalaryData): number {
  const workDaysPerYear = Math.max(365 - data.holidayDays, 1);
  switch (data.period) {
    case 'yearly':
      return data.amount;
    case 'monthly':
      return data.amount * 12;
    case 'weekly':
      return data.amount * 52;
    case 'hourly':
      return data.amount * data.workingHours * workDaysPerYear;
  }
}

export function formatMoney(
  amount: number,
  currency: string,
  minDecimals?: number,
): string {
  const symbol = currencySymbols[currency] ?? '';
  if (!Number.isFinite(amount)) return `${symbol}0.00`;
  const decimals =
    minDecimals ?? (amount > 0 && amount < 1 ? 4 : 2);
  return (
    symbol +
    amount.toLocaleString('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
}

export function formatRate(amount: number, currency: string): string {
  return formatMoney(amount, currency, amount < 1 ? 4 : 2);
}

export function formatNumber(n: number): string {
  return n.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
}

export function formatTime(totalSeconds: number): string {
  const seconds = Math.floor(totalSeconds) % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return '凌晨好，牛马';
  if (hour < 11) return '早上好，牛马';
  if (hour < 14) return '中午好，牛马';
  if (hour < 18) return '下午好，牛马';
  return '晚上好，牛马';
}
