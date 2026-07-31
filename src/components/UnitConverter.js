import { useState } from 'react';

// how many "base units" one of each unit equals (base = meters, kilograms)
const UNIT_GROUPS = {
  Length: { m: 1, km: 1000, cm: 0.01, mile: 1609.34, ft: 0.3048 },
  Weight: { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 },
};

function UnitConverter() {
  const [group, setGroup] = useState('Length');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('km');
  const [value, setValue] = useState('1');

  const units = UNIT_GROUPS[group];
  const converted = ((parseFloat(value) || 0) * units[from]) / units[to];

  function changeGroup(newGroup) {
    setGroup(newGroup);
    setFrom(Object.keys(UNIT_GROUPS[newGroup])[0]);
    setTo(Object.keys(UNIT_GROUPS[newGroup])[1]);
  }

  return (
    <div className="card converter-card">
      <h3>Unit Converter</h3>

      <div className="converter-row">
        <select value={group} onChange={(e) => changeGroup(e.target.value)} style={{ width: '100%' }}>
          {Object.keys(UNIT_GROUPS).map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>

      <div className="converter-row">
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          {Object.keys(units).map((u) => <option key={u}>{u}</option>)}
        </select>
      </div>

      <div className="converter-row">
        <div className="converter-result">{converted.toFixed(4)}</div>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {Object.keys(units).map((u) => <option key={u}>{u}</option>)}
        </select>
      </div>
    </div>
  );
}

export default UnitConverter;
