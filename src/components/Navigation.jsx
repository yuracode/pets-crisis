import { NavLink } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { THEMES } from '../themes';

const NAV_ITEMS = [
  { to: '/', label: 'ホーム', icon: '🏠' },
  { to: '/mypage', label: 'マイページ', icon: '📊' },
  { to: '/petcard', label: '防災カルテ', icon: '🐾' },
  { to: '/settings', label: '設定', icon: '⚙️' },
];

export const Navigation = () => {
  const { profile } = useProfile();
  const theme = THEMES[profile.ageGroup] || THEMES.standard;

  return (
    <nav className={`${theme.nav} fixed bottom-0 left-0 right-0 z-40`}>
      <div className="flex justify-around">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 text-xs font-medium transition-colors ${
                isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            <span className="text-2xl leading-none mb-1">{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
