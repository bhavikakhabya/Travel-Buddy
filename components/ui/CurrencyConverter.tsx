import React, { useState } from 'react';
import { ArrowRightLeft, Coins } from 'lucide-react';
import { currencies, convertCurrency } from '../../utils/helpers';

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');

  const result = convertCurrency(parseFloat(amount) || 0, fromCurrency, toCurrency);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg text-brand-600 dark:text-brand-400">
           <Coins size={18} />
        </div>
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">Quick Currency Converter</h3>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex-1 space-y-1">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-brand-500 dark:text-white"
          />
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full p-1 bg-transparent text-xs font-medium text-slate-500 dark:text-slate-400"
          >
            {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
          </select>
        </div>

        <ArrowRightLeft className="text-slate-300 dark:text-slate-600" size={16} />

        <div className="flex-1 space-y-1 text-right">
          <div className="w-full p-2 bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 rounded-lg text-sm font-bold text-brand-700 dark:text-brand-300 truncate">
            {result.toFixed(2)}
          </div>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full p-1 bg-transparent text-xs font-medium text-slate-500 dark:text-slate-400 text-right"
          >
            {currencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};
