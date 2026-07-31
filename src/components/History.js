import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useToast } from '../contexts/ToastContext';
import { StarIcon, TrashIcon, CopyIcon, SearchIcon } from './Icons';

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
    if (!window.confirm("Delete your entire history? This can't be undone.")) return;
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

  if (loading) return <div className="card empty-state">Loading history...</div>;

  return (
    <div className="card" style={{ padding: 22 }}>
      <div className="history-header">
        <h3>History</h3>
        <div className="history-actions">
          <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={showFavoritesOnly ? 'active' : ''} title="Favorites only">
            <StarIcon filled={showFavoritesOnly} />
          </button>
          <button onClick={clearAll} title="Clear all">
            <TrashIcon />
          </button>
        </div>
      </div>

      <div className="search-box">
        <SearchIcon />
        <input
          placeholder="Search your calculations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="history-list">
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
                  <StarIcon filled={calc.is_favorite} />
                </button>
                <button onClick={() => copyResult(calc.result)}>
                  <CopyIcon />
                </button>
                <button onClick={() => deleteOne(calc.id)}>
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;
