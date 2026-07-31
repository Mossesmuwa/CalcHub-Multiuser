import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Logo from '../components/Logo';
import { ArrowLeftIcon } from '../components/Icons';
import { useToast } from '../contexts/ToastContext';

function Profile({ user }) {
  const [displayName, setDisplayName] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()
      .then(({ data }) => { if (data) setDisplayName(data.display_name || ''); });
  }, [user.id]);

  async function saveName() {
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', user.id);
    if (!error) showToast('Profile updated');
  }

  return (
    <div className="app-shell">
      <div className="navbar">
        <Logo />
        <Link to="/" className="icon-button"><ArrowLeftIcon /></Link>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div className="field">
          <label>Email</label>
          <input value={user.email} disabled />
        </div>
        <div className="field">
          <label>Display name</label>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={saveName}>Save changes</button>
      </div>
    </div>
  );
}

export default Profile;
