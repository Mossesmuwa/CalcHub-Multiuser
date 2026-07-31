import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';
import { SunIcon, MoonIcon, UserIcon, PowerIcon } from './Icons';

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="navbar">
      <Logo />
      <div className="navbar-actions">
        <button className="icon-button" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <Link to="/profile" className="icon-button">
          <UserIcon />
        </Link>
        <button className="icon-button" onClick={() => supabase.auth.signOut()} title="Log out">
          <PowerIcon />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
