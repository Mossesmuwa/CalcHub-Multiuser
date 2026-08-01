import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Logo from "../components/Logo";
import GoogleIcon from "../components/GoogleIcon";
import { EyeIcon, EyeOffIcon } from "../components/Icons";
import { friendlyAuthError } from "../utils/errors";
import { isValidEmail } from "../utils/validate";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!isValidEmail(email)) {
      setError("That email address looks incomplete.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(friendlyAuthError(error.message));
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }

  async function handleForgotPassword() {
    setError("");
    setInfo("");
    if (!isValidEmail(email)) {
      setError('Type a valid email above first, then click "Forgot password".');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) setError(friendlyAuthError(error.message));
    else setInfo("Reset link sent — check your email.");
  }

  return (
    <div className="page-center">
      <div className="card auth-card">
        <Logo />
        <h1>Welcome back</h1>
        <p className="subtitle">Log in to keep using your calculator</p>

        {error && (
          <div className="form-error">
            {error}
            {error.includes("incorrect") && (
              <div className="form-error-hint">
                For your security, we don't say which one it is.
              </div>
            )}
          </div>
        )}
        {info && <div className="form-success">{info}</div>}

        <button
          className="btn-google"
          onClick={handleGoogle}
          disabled={googleLoading}
        >
          <GoogleIcon />{" "}
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </button>

        <div className="divider">or</div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field password-field">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <button className="btn-text" onClick={handleForgotPassword}>
          Forgot password?
        </button>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
