import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Logo from "../components/Logo";
import GoogleIcon from "../components/GoogleIcon";
import { EyeIcon, EyeOffIcon, CheckIcon, AlertIcon } from "../components/Icons";
import { checkPassword } from "../utils/passwordStrength";
import { friendlyAuthError } from "../utils/errors";
import { isValidEmail } from "../utils/validate";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const strength = checkPassword(password);
  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === password;
  const passwordsMismatch =
    confirmPassword.length > 0 && confirmPassword !== password;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("That email address looks incomplete.");
      return;
    }
    if (!strength.isStrong) {
      setError("Please meet all the password requirements below.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) setError(friendlyAuthError(error.message));
    else setInfo("Account created! Check your email to verify, then log in.");
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({ provider: "google" });
  }

  return (
    <div className="page-center">
      <div className="card auth-card">
        <Logo />
        <h1>Create your account</h1>
        <p className="subtitle">Start saving your calculations</p>

        {error && <div className="form-error">{error}</div>}
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
              autoComplete="new-password"
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

          {password && (
            <>
              <div className="strength-meter">
                <div
                  className="strength-meter-fill"
                  style={{
                    width: `${strength.percent}%`,
                    background: strength.color,
                  }}
                />
              </div>
              <div className="strength-label">{strength.label}</div>
              <div className="strength-checklist">
                <span className={strength.checks.length ? "met" : ""}>
                  8+ characters
                </span>
                <span className={strength.checks.upper ? "met" : ""}>
                  Uppercase letter
                </span>
                <span className={strength.checks.lower ? "met" : ""}>
                  Lowercase letter
                </span>
                <span className={strength.checks.number ? "met" : ""}>
                  Number
                </span>
              </div>
            </>
          )}

          <div className="field password-field">
            <label>Confirm password</label>
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {confirmPassword && (
            <div
              className={`match-indicator ${passwordsMatch ? "match-ok" : "match-bad"}`}
            >
              {passwordsMatch ? (
                <CheckIcon size={14} />
              ) : (
                <AlertIcon size={14} />
              )}
              {passwordsMatch ? "Passwords match" : "Passwords don't match yet"}
            </div>
          )}

          <button
            className="btn-primary"
            type="submit"
            disabled={loading || passwordsMismatch}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
