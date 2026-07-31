import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Logo from '../components/Logo';
import GoogleIcon from '../components/GoogleIcon';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Type your email above first, then click "Forgot password".');
      return;
    }
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    if (error) setError(error.message);
    else setInfo('Reset link sent — check your email.');
  }

  return (
    <div className="page-center">
      <div className="card auth-card">
        <Logo />
        <h1>Welcome back</h1>
        <p className="subtitle">Log in to keep using your calculator</p>

        {error && <div className="form-error">{error}</div>}
        {info && <div className="form-success">{info}</div>}

        <button className="btn-google" onClick={handleGoogle}>
          <GoogleIcon /> Continue with Google
        </button>

        <div className="divider">or</div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <button className="link-button" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, marginTop: 14 }}>
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
