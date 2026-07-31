import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useTheme } from "../contexts/ThemeContext";
import Logo from "./Logo";
import { SunIcon, MoonIcon, UserIcon, PowerIcon } from "./Icons";

function Navbar({ user }) {
  const { theme, toggleTheme } = useTheme();
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      });
  }, [user.id]);

  return (
    <div className="navbar">
      <Logo />
      <div className="navbar-actions">
        <button
          className="icon-button"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <Link to="/profile" className="icon-button avatar-nav">
          {avatarUrl ? <img src={avatarUrl} alt="Profile" /> : <UserIcon />}
        </Link>
        <button
          className="icon-button"
          onClick={() => supabase.auth.signOut()}
          title="Log out"
        >
          <PowerIcon />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
