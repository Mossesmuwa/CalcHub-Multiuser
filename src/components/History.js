import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useToast } from '../contexts/ToastContext';

function History({ user, refreshKey }) {
  const [calculations, setCalculations] = useState([]);
  const [search, setSearch] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('calculations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!cancelled && !error) setCalculations(data);
      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [user.id, refreshKey]);

  async function toggleFavorite(calc) {
    const { error } = await supabase
      .from('calculations')
      .update({ is_favorite: !calc.is_favorite })
      .eq('id', calc.id);

    if (!error) {
      setCalculations(calculations.map((c) =>
        c.id === calc.id ? { ...c, is_favorite: !c.is_favorite } : c
      ));
    }
  }

  async function deleteOne(id) {
    const { error } = await supabase.from('calculations').delete().eq('id', id);
    if (!error) {
      setCalculations(calculations.filter((c) => c.id !== id));
      showToast('Deleted');
    }
  }

  async function clearAll() {
    if (!window.confirm('Delete your entire history? This can\'t be undone.')) return;
    const { error } = await supabase.from('calculations').delete().eq('user_id', user.id);
    if (!error) {
      setCalculations([]);
      showToast('History cleared');
    }
  }

  function copyResult(value) {
    navigator.clipboard.writeText(value);
    showToast('Copied to clipboard');
  }

  const visible = calculations
    .filter((c) => !showFavoritesOnly || c.is_favorite)
    .filter((c) => c.expression.includes(search) || c.result.includes(search));

  if (loading) return <p className="empty-state">Loading history...</p>;

  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="history-header">
        <h3 style={{ margin: 0, fontSize: 16 }}>History</h3>
        <div className="history-actions">
          <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={showFavoritesOnly ? 'active' : ''}>
            ⭐
          </button>
          <button onClick={clearAll}>🗑</button>
        </div>
      </div>

      <input
        className="history-search"
        placeholder="Search your calculations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {visible.length === 0 ? (
        <p className="empty-state">No calculations match yet.</p>
      ) : (
        visible.map((calc) => (
          <div className="history-item" key={calc.id}>
            <div className="history-main">
              <span className="history-expr">{calc.expression}</span>
              <span className="history-result">= {calc.result}</span>
              <span className="history-time">{new Date(calc.created_at).toLocaleString()}</span>
            </div>
            <div className="history-actions">
              <button onClick={() => toggleFavorite(calc)} className={calc.is_favorite ? 'active' : ''}>
                {calc.is_favorite ? '⭐' : '☆'}
              </button>
              <button onClick={() => copyResult(calc.result)}>📋</button>
              <button onClick={() => deleteOne(calc.id)}>🗑</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default History;
