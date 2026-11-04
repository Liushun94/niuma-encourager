import { useState } from 'react';
import { TitleBar } from './components/TitleBar';
import { SetupScreen } from './components/SetupScreen';
import { Dashboard } from './components/Dashboard';
import { SalaryData } from './types';

const STORAGE_KEY = 'niuma.salary.v1';

function loadSalary(): SalaryData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SalaryData;
    const validPeriods = ['yearly', 'monthly', 'weekly', 'hourly'];
    if (
      typeof data.amount === 'number' &&
      Number.isFinite(data.amount) &&
      data.amount > 0 &&
      typeof data.workingHours === 'number' &&
      data.workingHours > 0 &&
      data.workingHours <= 24 &&
      typeof data.holidayDays === 'number' &&
      data.holidayDays >= 0 &&
      data.holidayDays <= 365 &&
      validPeriods.includes(data.period)
    ) {
      return data;
    }
  } catch {
    // ignore broken storage
  }
  return null;
}

export default function App() {
  const [salary, setSalary] = useState<SalaryData | null>(() => loadSalary());
  const [editing, setEditing] = useState(false);
  const [session, setSession] = useState(0);

  const handleStart = (data: SalaryData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // storage is optional
    }
    setSalary(data);
    setEditing(false);
    setSession((value) => value + 1);
  };

  const showSetup = !salary || editing;

  return (
    <div className="app">
      <TitleBar />
      <main className={`app-main${showSetup ? ' app-main--setup' : ''}`}>
        {showSetup ? (
          <SetupScreen initial={salary} onStart={handleStart} />
        ) : (
          <Dashboard
            key={session}
            salary={salary}
            onReset={() => setEditing(true)}
          />
        )}
      </main>
    </div>
  );
}
