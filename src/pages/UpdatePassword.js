import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Logo from "../components/Logo";
import { EyeIcon, EyeOffIcon, CheckIcon, AlertIcon } from "../components/Icons";
import { checkPassword } from "../utils/passwordStrength";
import { friendlyAuthError } from "../utils/errors";

function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const strength = checkPassword(password);
  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === password;
  const passwordsMismatch =
    confirmPassword.length > 0 && confirmPassword !== password;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!strength.isStrong) {
      setError("Please meet all the password requirements below.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) setError(friendlyAuthError(error.message));
    else setDone(true);
  }

  return (
    <div className="page-center">
      <div className="card auth-card">
        <Logo />
        <h1>Set a new password</h1>
        <p className="subtitle">Choose something you haven't used before</p>

        {error && <div className="form-error">{error}</div>}

        {done ? (
          <>
            <div className="form-success">Password updated!</div>
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Back to Log In
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field password-field">
              <label>New password</label>
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
                {showPassword ? (
                  <EyeOffIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
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
              <label>Confirm new password</label>
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
                {passwordsMatch
                  ? "Passwords match"
                  : "Passwords don't match yet"}
              </div>
            )}

            <button
              className="btn-primary"
              type="submit"
              disabled={loading || passwordsMismatch}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default UpdatePassword;
