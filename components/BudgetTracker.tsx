
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Wallet, Plus, Trash2, TrendingUp, Plane, Hotel, Ticket, Utensils, IndianRupee, Pencil, Calendar as CalendarIcon, PieChart, Tag, AlertTriangle, Flag, X, ShoppingBag, Car, Bus, Train, Coffee, Bed } from 'lucide-react';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

const DEFAULT_CATEGORIES = ['Flights', 'Accommodation', 'Activities', 'Food'];
const COLOR_PALETTE = [
  'bg-blue-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500', 
  'bg-emerald-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-lime-500', 'bg-pink-500', 'bg-orange-500'
];

export const BudgetTracker: React.FC = () => {
  const [budget, setBudget] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  
  // Form state
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<string>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Custom Category State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('travel_buddy_budget_data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setBudget(data.budget || 0);
        setExpenses(data.expenses || []);
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (e) {
        console.error("Error loading budget data");
      }
    }
  }, []);

  const saveData = (newBudget: number, newExpenses: Expense[], newCategories?: string[]) => {
    const catsToSave = newCategories || categories;
    localStorage.setItem('travel_buddy_budget_data', JSON.stringify({
      budget: newBudget,
      expenses: newExpenses,
      categories: catsToSave
    }));
  };

  const handleSetBudget = () => {
    saveData(budget, expenses);
    setIsEditingBudget(false);
  };

  const addExpense = () => {
    if (!amount || !desc || !date) return;
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      description: desc,
      category,
      date: new Date(date).toISOString()
    };
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    saveData(budget, updatedExpenses);
    setAmount('');
    setDesc('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    saveData(budget, updated);
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      setCategory(newCategoryName.trim());
      setIsAddingCategory(false);
      setNewCategoryName('');
      return;
    }
    const updatedCats = [...categories, newCategoryName.trim()];
    setCategories(updatedCats);
    setCategory(newCategoryName.trim());
    saveData(budget, expenses, updatedCats);
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = budget - totalSpent;
  const progress = budget > 0 ? (totalSpent / budget) * 100 : 0;
  const isNearLimit = progress >= 90;
  const isOverLimit = progress > 100;

  // Calculate category breakdown
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const getCategoryColor = (cat: string) => {
    const index = categories.indexOf(cat);
    return COLOR_PALETTE[index % COLOR_PALETTE.length] || 'bg-slate-500';
  };

  const getCategoryIcon = (cat: string) => {
    // Normalize string for better matching
    const lowerCat = cat.toLowerCase();
    
    if (lowerCat.includes('flight') || lowerCat.includes('plane') || lowerCat.includes('air')) return <Plane size={18} />;
    if (lowerCat.includes('hotel') || lowerCat.includes('stay') || lowerCat.includes('accommodation')) return <Bed size={18} />;
    if (lowerCat.includes('activit') || lowerCat.includes('ticket') || lowerCat.includes('tour')) return <Ticket size={18} />;
    if (lowerCat.includes('food') || lowerCat.includes('eat') || lowerCat.includes('restaur')) return <Utensils size={18} />;
    if (lowerCat.includes('coffee') || lowerCat.includes('cafe')) return <Coffee size={18} />;
    if (lowerCat.includes('shop')) return <ShoppingBag size={18} />;
    if (lowerCat.includes('car') || lowerCat.includes('taxi') || lowerCat.includes('uber')) return <Car size={18} />;
    if (lowerCat.includes('bus')) return <Bus size={18} />;
    if (lowerCat.includes('train') || lowerCat.includes('rail')) return <Train size={18} />;
    
    return <Tag size={18} />;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Header & Budget Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trip Budget</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Track your travel expenses in ₹</p>
          </div>
          {!isEditingBudget && (
             <button 
               onClick={() => setIsEditingBudget(true)}
               className="p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors flex items-center text-sm font-semibold"
             >
               <Pencil size={16} className="mr-2" /> Edit Budget
             </button>
          )}
        </div>

        {isEditingBudget ? (
          <div className="space-y-3 animate-in fade-in duration-200">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Set Total Budget</label>
             <div className="flex gap-2">
                <div className="relative flex-1">
                   <span className="absolute left-4 top-3.5 text-slate-400 font-bold">₹</span>
                   <input 
                    type="number" 
                    value={budget} 
                    onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-brand-500 dark:border-brand-600 rounded-xl font-bold text-lg text-slate-900 dark:text-white focus:outline-none"
                    placeholder="e.g. 50000"
                    autoFocus
                  />
                </div>
                <Button onClick={handleSetBudget} className="px-6">Save</Button>
             </div>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl relative group">
                   <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Total Budget</p>
                   <div className="flex items-center gap-2">
                     <p className="text-3xl font-black text-slate-900 dark:text-white">₹{budget.toLocaleString()}</p>
                     <button 
                       onClick={() => setIsEditingBudget(true)}
                       className="p-1.5 text-slate-400 hover:text-brand-500 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all opacity-0 group-hover:opacity-100"
                       title="Edit Budget"
                     >
                       <Pencil size={14} />
                     </button>
                   </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                   <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Remaining</p>
                   <p className={`text-3xl font-black ${remaining < 0 ? 'text-red-500' : 'text-emerald-500'}`}>₹{remaining.toLocaleString()}</p>
                </div>
             </div>
             
             {/* Enhanced Goal Visualizer / Progress Bar */}
             <div className="space-y-3 pt-2">
               <div className="flex justify-between text-xs font-semibold text-slate-400">
                  <span className="text-slate-900 dark:text-slate-200">₹0</span>
                  <span className={`${isOverLimit ? 'text-red-500' : isNearLimit ? 'text-orange-500' : 'text-slate-400'}`}>
                    {Math.round(progress)}% of Goal
                  </span>
               </div>
               
               <div className="relative h-8 bg-slate-100 dark:bg-slate-800 rounded-full w-full mt-1">
                  {/* Warning Marker at 90% */}
                  <div className="absolute top-0 bottom-0 w-0.5 bg-yellow-400/50 z-10 border-r border-dashed border-yellow-500" style={{ left: '90%' }}></div>
                  
                  {/* Limit Marker at 100% */}
                  <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-red-500 z-10"></div>
                  <div className="absolute -right-2 -top-7 flex flex-col items-center z-10">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">Limit</span>
                    <div className="w-0.5 h-2 bg-red-500"></div>
                  </div>

                  {/* Stacked Bar Chart (Actual Progress) */}
                  <div className="h-full rounded-full overflow-hidden flex relative z-0">
                    {totalSpent > 0 ? (
                      categories.map((cat) => {
                        const catAmount = categoryTotals[cat] || 0;
                        if (catAmount === 0) return null;
                        const pct = (catAmount / (budget || 1)) * 100;
                        const color = getCategoryColor(cat);
                        return (
                           <div 
                             key={cat} 
                             className={`h-full ${color} border-r border-white/20 last:border-0 transition-all duration-500`}
                             style={{ width: `${pct}%` }}
                             title={`${cat}: ₹${catAmount.toLocaleString()}`}
                           />
                        )
                      })
                    ) : (
                      <div className="w-0 h-full" />
                    )}
                  </div>
               </div>

               {/* Status Message */}
               {isOverLimit ? (
                 <div className="flex items-center text-xs font-bold text-red-500 mt-1 animate-pulse">
                   <AlertTriangle size={14} className="mr-1" /> Over budget by ₹{Math.abs(remaining).toLocaleString()}
                 </div>
               ) : isNearLimit ? (
                 <div className="flex items-center text-xs font-bold text-orange-500 mt-1">
                   <AlertTriangle size={14} className="mr-1" /> Nearing budget limit ({Math.round(progress)}%)
                 </div>
               ) : (
                 <div className="text-right text-xs text-slate-400 mt-1">
                   ₹{remaining.toLocaleString()} left to spend
                 </div>
               )}
               
               {/* Chart Legend */}
               {totalSpent > 0 && (
                 <div className="flex flex-wrap gap-3 mt-4 justify-start">
                    {categories.map((cat) => {
                      const amt = categoryTotals[cat] || 0;
                      if (amt === 0) return null;
                      const color = getCategoryColor(cat);
                      return (
                        <div key={cat} className="flex items-center text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                          <div className={`w-2.5 h-2.5 rounded-full ${color} mr-1.5`}></div>
                          {cat}: <span className="ml-1 font-bold">₹{amt.toLocaleString()}</span>
                        </div>
                      );
                    })}
                 </div>
               )}
             </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Add Expense Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 h-fit">
           <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center">
             <Plus className="w-5 h-5 mr-2 text-brand-500" /> Add Expense
           </h3>
           <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex justify-between items-center mb-1">
                  Category
                </label>
                
                {isAddingCategory ? (
                   <div className="flex gap-2 animate-in fade-in duration-200">
                     <input 
                       type="text" 
                       value={newCategoryName}
                       onChange={(e) => setNewCategoryName(e.target.value)}
                       placeholder="New Category Name"
                       className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-brand-500 rounded-lg text-xs font-medium focus:outline-none"
                       autoFocus
                       onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                     />
                     <button onClick={handleAddCategory} className="p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
                       <Plus size={16} />
                     </button>
                     <button onClick={() => setIsAddingCategory(false)} className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 transition-colors">
                       <X size={16} />
                     </button>
                   </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`p-2 rounded-lg text-xs font-medium transition-colors border text-left truncate ${category === cat ? 'bg-brand-50 border-brand-200 text-brand-700 dark:bg-brand-900/20 dark:border-brand-800 dark:text-brand-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                      >
                        {cat}
                      </button>
                    ))}
                    <button 
                      onClick={() => setIsAddingCategory(true)}
                      className="p-2 rounded-lg text-xs font-medium transition-colors border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-brand-400 hover:text-brand-500 flex items-center justify-center"
                    >
                      <Plus size={14} className="mr-1" /> New
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Date</label>
                 <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 text-slate-400 w-4 h-4 pointer-events-none" />
                    <input 
                      type="date" 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full mt-1 pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                 </div>
              </div>

              <div>
                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Details</label>
                 <input 
                   type="text" 
                   value={desc} 
                   onChange={(e) => setDesc(e.target.value)}
                   placeholder="Description (e.g. Lunch at Cafe)"
                   className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                 />
              </div>

              <div>
                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Amount (₹)</label>
                 <div className="relative">
                   <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
                   <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full mt-1 pl-8 pr-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                   />
                 </div>
              </div>

              <Button onClick={addExpense} className="w-full mt-2" disabled={!amount || !desc || !date}>
                Add Transaction
              </Button>
           </div>
        </div>

        {/* Expense List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
           <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white flex items-center">
             <TrendingUp className="w-5 h-5 mr-2 text-brand-500" /> Recent Activity
           </h3>
           
           <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
             {expenses.length === 0 && (
               <div className="text-center py-8 text-slate-400 text-sm">
                 No expenses logged yet.
               </div>
             )}
             {expenses.map((expense) => (
               <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 group hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
                 <div className="flex items-center space-x-3">
                   <div className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                      {getCategoryIcon(expense.category)}
                   </div>
                   <div>
                     <p className="font-semibold text-slate-900 dark:text-white text-sm">{expense.description}</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                       {expense.category} • {new Date(expense.date).toLocaleDateString()}
                     </p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-3">
                    <span className="font-bold text-slate-900 dark:text-white">₹{expense.amount.toFixed(0)}</span>
                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};
