import { useEffect, useState } from 'react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN', 'JPY', 'CAD', 'ZAR', 'KES'];

function CurrencyConverter() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('NGN');
  const [amount, setAmount] = useState('1');
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`https://open.er-api.com/v6/latest/${from}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setRate(data.rates[to]);
      })
      .catch(() => { if (!cancelled) setRate(null); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [from, to]);

  const result = rate ? (parseFloat(amount) || 0) * rate : null;

  return (
    <div className="card converter-card">
      <h3>Currency Converter</h3>

      <div className="converter-row">
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="converter-row">
        <div className="converter-result">
          {loading ? '···' : result ? result.toFixed(2) : '—'}
        </div>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );
}

export default CurrencyConverter;
