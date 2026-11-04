export type Period = 'yearly' | 'monthly' | 'weekly' | 'hourly';

export interface SalaryData {
  amount: number;
  period: Period;
  currency: string;
  workingHours: number;
  holidayDays: number;
}

export const periodLabels: Record<Period, string> = {
  yearly: '年薪',
  monthly: '月薪',
  weekly: '周薪',
  hourly: '时薪',
};

export const currencySymbols: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

export const currencyNames: Record<string, string> = {
  CNY: '人民币',
  USD: '美元',
  EUR: '欧元',
  GBP: '英镑',
  JPY: '日元',
};

export const salaryPresets: Array<{
  label: string;
  amount: number;
  period: Period;
}> = [
  { label: '月薪 5k', amount: 5000, period: 'monthly' },
  { label: '月薪 1万', amount: 10000, period: 'monthly' },
  { label: '月薪 2万', amount: 20000, period: 'monthly' },
  { label: '年薪 50万', amount: 500000, period: 'yearly' },
  { label: '年薪 100万', amount: 1000000, period: 'yearly' },
  { label: '时薪 50', amount: 50, period: 'hourly' },
  { label: '躺赚一个亿', amount: 100000000, period: 'yearly' },
];

export const quotes: string[] = [
  '只要我磨得够快，贫穷就追不上我。',
  '胡萝卜就在前面，再磨一圈就到了。',
  '老板画的饼，是我拉磨的动力。',
  '今天流的汗，是明天工资的利息。',
  '磨盘不会骗人，它真的在转。',
  '牛马没有眼泪，只有进度条。',
  '再坚持一下，马上就到下班时间了。',
  '工资是按秒长的，摸鱼是按分扣的。',
  '你不拉磨，磨就拉你。',
  '每一圈都算数，每一分都到账。',
];
