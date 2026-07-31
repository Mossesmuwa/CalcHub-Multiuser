import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function History({ user, refreshKey }) {
  const [calculations, setCalculations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [refreshKey]);

  async function loadHistory() {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('calculations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setCalculations(data);
    setIsLoading(false);
  }

  if (isLoading) return <p>Loading your history...</p>;
  if (calculations.length === 0) return <p>No calculations yet.</p>;

  return (
    <div className="history">
      <h3>Your Calculation History</h3>
      <ul>
        {calculations.map((calc) => (
          <li key={calc.id}>
            <span>{calc.expression} = {calc.result}</span>
            <span className="history-date">
              {new Date(calc.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;
