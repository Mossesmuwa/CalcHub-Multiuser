import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Logo from '../components/Logo';

function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
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
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Back to Log In
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button className="btn-primary" type="submit">
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default UpdatePassword;
