import { useState } from 'react';
import { supabase } from '../supabaseClient';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    if (isSigningUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage('Account created! Check your email, then log in.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setMessage('Type your email above first.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setMessage(error.message);
    else setMessage('Password reset link sent to your email.');
  }

  return (
    <div className="auth-container">
      <div className="logo">🧮 Calculator App</div>
      <h2>{isSigningUp ? 'Create an Account' : 'Log In'}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit">{isSigningUp ? 'Sign Up' : 'Log In'}</button>
      </form>

      {message && <p className="message">{message}</p>}

      <button className="link-button" onClick={() => setIsSigningUp(!isSigningUp)}>
        {isSigningUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
      </button>

      {!isSigningUp && (
        <button className="link-button" onClick={handleForgotPassword}>
          Forgot password?
        </button>
      )}
    </div>
  );
}

export default Auth;
