
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Trash2, 
  Delete, 
  Sun, 
  Moon, 
  Calculator as CalcIcon,
  RotateCcw,
  X
} from 'lucide-react';
import { CalculatorEngine, type HistoryItem } from './utils/calculator';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const engine = new CalculatorEngine();

const App: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | number>('0');
  const [status, setStatus] = useState('Ready');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('calc_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    const savedTheme = localStorage.getItem('calc_theme') as 'light' | 'dark';
    if (savedTheme) setTheme(savedTheme || 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('calc_theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const handleCalculate = () => {
    if (!expression.trim()) {
      setStatus('Enter an expression');
      return;
    }
    try {
      const res = engine.evaluate(expression);
      const rendered = Number.isInteger(res) ? res : parseFloat(res.toFixed(8));
      setResult(rendered);
      setStatus('Calculated');
      setHistory(prev => [{ expression, result: rendered, timestamp: Date.now() }, ...prev].slice(0, 50));
    } catch (err: any) {
      setResult('Error');
      setStatus(err.message || 'Invalid expression');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCalculate();
    if (e.key === 'Escape') clearAll();
  };

  const appendToExpression = (val: string) => {
    setExpression(prev => prev + val);
    inputRef.current?.focus();
  };

  const backspace = () => setExpression(prev => prev.slice(0, -1));
  const clearAll = () => {
    setExpression('');
    setResult('0');
    setStatus('Ready');
  };

  const reuseHistory = (item: HistoryItem) => {
    setExpression(item.expression);
    setResult(item.result);
    setStatus('Restored');
  };

  const buttons = [
    { label: 'abs(', type: 'func' }, { label: 'sqrt(', type: 'func' }, { label: 'pow(', type: 'func' }, { label: 'mod(', type: 'func' },
    { label: '(', type: 'soft' }, { label: ')', type: 'soft' }, { label: '%', type: 'soft' }, { label: '/', type: 'op' },
    { label: '7', type: 'num' }, { label: '8', type: 'num' }, { label: '9', type: 'num' }, { label: '*', type: 'op' },
    { label: '4', type: 'num' }, { label: '5', type: 'num' }, { label: '6', type: 'num' }, { label: '-', type: 'op' },
    { label: '1', type: 'num' }, { label: '2', type: 'num' }, { label: '3', type: 'num' }, { label: '+', type: 'op' },
    { label: '0', type: 'num', span: 2 }, { label: '.', type: 'num' }, { label: '=', type: 'eq' },
  ];

  return (
    <div className={cn(
      "fixed inset-0 overflow-hidden transition-colors duration-500 bg-[#0f1115]"
    )}>
      <div className={cn(
        "relative w-full h-full bg-white dark:bg-[#1a1d23] overflow-hidden flex flex-col transition-all duration-300"
      )}>
        
        {/* Window Title Bar (Mac Style) */}
        <div className="h-10 shrink-0 bg-gray-50/50 dark:bg-black/20 border-b border-gray-100 dark:border-white/5 flex items-center px-4 justify-between select-none">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">NovaCalc — Application</span>
          <div className="w-12" />
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Content */}
          <div className="flex-1 flex flex-col p-[clamp(14px,1.8vmin,28px)] overflow-hidden">
            <header className="flex items-center justify-between mb-[clamp(10px,1.4vmin,20px)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg">
                  <CalcIcon className="text-white w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold dark:text-white">NovaCalc</h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                  className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className={cn(
                    "p-2.5 rounded-xl flex items-center gap-2 font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95",
                    isHistoryOpen
                      ? "bg-indigo-500 text-white hover:bg-indigo-600"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                >
                  <History size={18} />
                  <span className="hidden sm:inline">History</span>
                </button>
              </div>
            </header>

            <div className="bg-gray-50 dark:bg-[#22272e] rounded-[24px] p-[clamp(14px,1.8vmin,28px)] mb-[clamp(10px,1.4vmin,20px)] border border-gray-100 dark:border-gray-800 shrink-0">
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Expression</p>
              <input
                ref={inputRef}
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full bg-transparent text-[clamp(18px,2.2vmin,30px)] font-mono dark:text-white focus:outline-none"
                placeholder="0"
                autoFocus
              />
              <div className="mt-6 text-right">
                <AnimatePresence mode="wait">
                  <motion.div key={result} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-[clamp(36px,5vmin,66px)] font-bold dark:text-white truncate">
                    {result}
                  </motion.div>
                </AnimatePresence>
                <p className={cn("text-xs mt-1", status === 'Error' ? "text-red-500" : "text-gray-400")}>{status}</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-4 gap-[clamp(8px,1.1vmin,14px)] min-h-0">
              <div className="col-span-4 flex gap-[clamp(8px,1.1vmin,14px)] h-[clamp(42px,5.2vmin,54px)] shrink-0">
                <button
                  onClick={clearAll}
                  className="flex-1 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} /> CLEAR
                </button>
                <button
                  onClick={backspace}
                  className="w-16 sm:w-20 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
                >
                  <Delete size={18} />
                </button>
              </div>

              {buttons.map((btn) => (
                <motion.button
                  key={btn.label}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => btn.label === '=' ? handleCalculate() : appendToExpression(btn.label)}
                  className={cn(
                    "rounded-[16px] sm:rounded-[20px] text-[clamp(16px,1.8vmin,24px)] font-bold transition-all shadow-sm min-h-[clamp(40px,5.4vmin,64px)]",
                    btn.span === 2 ? "col-span-2" : "col-span-1",
                    btn.type === 'num'
                      ? "bg-white dark:bg-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-[1.03] active:scale-[0.97]"
                      : btn.type === 'op'
                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/35 hover:scale-[1.03] active:scale-[0.97]"
                        : btn.type === 'eq'
                          ? "bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-[1.03] active:scale-[0.97]"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-[1.03] active:scale-[0.97]"
                  )}
                >
                  {btn.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <AnimatePresence>
            {isHistoryOpen && (
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="absolute right-0 top-0 bottom-0 w-full sm:w-[340px] bg-white dark:bg-[#1f2329] shadow-2xl z-20 border-l border-gray-100 dark:border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                  <h2 className="font-bold dark:text-white">History</h2>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setHistory([])} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    <button
                      onClick={() => setIsHistoryOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                      aria-label="Close history"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {history.map((item, idx) => (
                    <div key={idx} onClick={() => reuseHistory(item)} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                      <p className="text-xs text-gray-400 font-mono truncate">{item.expression}</p>
                      <p className="text-lg font-bold dark:text-white truncate">= {item.result}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default App;
