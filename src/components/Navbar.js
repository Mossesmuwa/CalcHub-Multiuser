import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useTheme } from "../contexts/ThemeContext";
import Logo from "./Logo";
import { SunIcon, MoonIcon, UserIcon, PowerIcon } from "./Icons";

function Navbar({ user }) {
  const { theme, toggleTheme } = useTheme();
  const [avatarUrl, setAvatarUrl] = useState("");

  const loadAvatar = useCallback(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Could not load avatar:", error.message);
      return;
    }
    setAvatarUrl(data?.avatar_url || "");
  }, [user.id]);

  useEffect(() => {
    loadAvatar();

    // Profile.js fires this the moment a new picture is uploaded or removed,
    // so the navbar updates immediately without needing a page reload.
    window.addEventListener("avatar-changed", loadAvatar);
    return () => window.removeEventListener("avatar-changed", loadAvatar);
  }, [loadAvatar]);

  return (
    <div className="navbar">
      <Logo />
      <div className="navbar-actions">
        <button
          className="icon-button"
          onClick={toggleTheme}
          title="Toggle theme"
          aria-label="Toggle dark or light mode"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <Link
          to="/profile"
          className="icon-button avatar-nav"
          aria-label="Your profile"
        >
          {avatarUrl ? <img src={avatarUrl} alt="Profile" /> : <UserIcon />}
        </Link>
        <button
          className="icon-button"
          onClick={() => supabase.auth.signOut()}
          title="Log out"
          aria-label="Log out"
        >
          <PowerIcon />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
