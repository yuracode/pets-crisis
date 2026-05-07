export const THEMES = {
  standard: {
    label: '標準（30〜50代）',
    root: 'bg-stone-50 text-slate-800 font-sans',
    card: 'bg-white border border-stone-200 rounded-2xl shadow-sm',
    button: {
      primary: 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-6 py-3 transition-colors',
      secondary: 'bg-stone-100 hover:bg-stone-200 text-slate-700 font-medium rounded-xl px-6 py-3 transition-colors',
      choice: 'w-full text-left bg-white hover:bg-emerald-50 border-2 border-stone-200 hover:border-emerald-400 text-slate-800 font-medium rounded-xl px-5 py-4 transition-all',
      choiceSelected: 'w-full text-left bg-emerald-50 border-2 border-emerald-500 text-emerald-800 font-medium rounded-xl px-5 py-4',
    },
    nav: 'bg-white border-t border-stone-200',
    header: 'bg-emerald-600 text-white',
    badge: {
      best: 'bg-emerald-100 text-emerald-800',
      better: 'bg-blue-100 text-blue-800',
      risk: 'bg-amber-100 text-amber-800',
      danger: 'bg-red-100 text-red-800',
    },
    rank: {
      S: 'text-emerald-600',
      A: 'text-blue-600',
      B: 'text-amber-600',
      C: 'text-orange-600',
      D: 'text-red-600',
    },
  },
  youth: {
    label: 'ゲーム風（Z世代・学生）',
    root: 'bg-slate-900 text-green-400 font-black',
    card: 'bg-slate-800 border border-green-500/30 rounded-2xl shadow-lg shadow-green-500/10',
    button: {
      primary: 'bg-green-500 hover:bg-green-400 text-black font-black rounded-xl px-6 py-3 transition-colors uppercase tracking-wider',
      secondary: 'bg-slate-700 hover:bg-slate-600 text-green-400 font-bold rounded-xl px-6 py-3 transition-colors',
      choice: 'w-full text-left bg-slate-800 hover:bg-slate-700 border-2 border-green-500/30 hover:border-green-400 text-green-300 font-bold rounded-xl px-5 py-4 transition-all',
      choiceSelected: 'w-full text-left bg-green-500/20 border-2 border-green-400 text-green-200 font-bold rounded-xl px-5 py-4',
    },
    nav: 'bg-slate-900 border-t border-green-500/30',
    header: 'bg-slate-900 border-b border-green-500/30 text-green-400',
    badge: {
      best: 'bg-green-500/20 text-green-400',
      better: 'bg-blue-500/20 text-blue-400',
      risk: 'bg-yellow-500/20 text-yellow-400',
      danger: 'bg-red-500/20 text-red-400',
    },
    rank: {
      S: 'text-green-400',
      A: 'text-cyan-400',
      B: 'text-yellow-400',
      C: 'text-orange-400',
      D: 'text-red-400',
    },
  },
  senior: {
    label: 'シンプル大文字（シニア）',
    root: 'bg-orange-50 text-slate-900 font-bold text-xl',
    card: 'bg-white border-2 border-orange-200 rounded-2xl shadow-md',
    button: {
      primary: 'bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl px-8 py-5 text-xl transition-colors',
      secondary: 'bg-stone-100 hover:bg-stone-200 text-slate-700 font-bold rounded-2xl px-8 py-5 text-xl transition-colors',
      choice: 'w-full text-left bg-white hover:bg-orange-50 border-3 border-orange-200 hover:border-orange-400 text-slate-900 font-bold rounded-2xl px-6 py-6 text-xl transition-all',
      choiceSelected: 'w-full text-left bg-orange-50 border-3 border-orange-500 text-orange-900 font-bold rounded-2xl px-6 py-6 text-xl',
    },
    nav: 'bg-white border-t-2 border-orange-200',
    header: 'bg-orange-500 text-white',
    badge: {
      best: 'bg-green-100 text-green-900 text-lg',
      better: 'bg-blue-100 text-blue-900 text-lg',
      risk: 'bg-amber-100 text-amber-900 text-lg',
      danger: 'bg-red-100 text-red-900 text-lg',
    },
    rank: {
      S: 'text-green-700',
      A: 'text-blue-700',
      B: 'text-amber-700',
      C: 'text-orange-700',
      D: 'text-red-700',
    },
  },
};

export const DEFAULT_THEME = 'standard';
