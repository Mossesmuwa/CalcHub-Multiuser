import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function Calculator({ user, onSaved }) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [justCalculated, setJustCalculated] = useState(false);
  const [scientific, setScientific] = useState(false);
  const [memory, setMemory] = useState(0);

  // turns what the user typed into real JS math
  function toJsExpression(expr) {
    return expr
      .replace(/π/g, 'Math.PI')
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/\^/g, '**')
      .replace(/%/g, '/100');
  }

  function press(value) {
    if (justCalculated && !'+-*/^'.includes(value)) {
      setExpression(value);
    } else if (justCalculated) {
      setExpression(result + value);
    } else {
      setExpression(expression + value);
    }
    setJustCalculated(false);
    setResult('');
  }

  function clearAll() {
    setExpression('');
    setResult('');
    setJustCalculated(false);
  }

  function backspace() {
    setExpression(expression.slice(0, -1));
  }

  async function calculate() {
    if (!expression) return;

    let value;
    try {
      // eslint-disable-next-line no-eval
      value = eval(toJsExpression(expression));
      if (!isFinite(value)) throw new Error('bad math');
      value = Math.round(value * 1e10) / 1e10; // trim floating point noise
    } catch {
      setResult('Error');
      setJustCalculated(true);
      return;
    }

    setResult(value.toString());
    setJustCalculated(true);

    const { error } = await supabase.from('calculations').insert({
      user_id: user.id,
      expression,
      result: value.toString(),
    });
    if (!error) onSaved();
  }

  // memory buttons
  function memoryClear() { setMemory(0); }
  function memoryRecall() { press(memory.toString()); }
  function memoryAdd() {
    const current = parseFloat(result || expression) || 0;
    setMemory(memory + current);
  }
  function memorySubtract() {
    const current = parseFloat(result || expression) || 0;
    setMemory(memory - current);
  }

  // keyboard support
  useEffect(() => {
    function handleKey(e) {
      if (/[0-9.+\-*/()]/.test(e.key)) press(e.key);
      else if (e.key === 'Enter') calculate();
      else if (e.key === 'Backspace') backspace();
      else if (e.key === 'Escape') clearAll();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const basicButtons = [
    ['AC', '(', ')', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '⌫', '='],
  ];

  const scientificButtons = ['sin(', 'cos(', 'tan(', '√(', 'log(', 'ln(', '^', 'π', '%'];

  return (
    <div className="card calculator">
      <div className="calc-screen">
        <div className="calc-expression">{expression || ' '}</div>
        <div className="calc-result">{result || expression || '0'}</div>
      </div>

      <div className="calc-mode-toggle">
        <div className="tabs" style={{ width: '100%' }}>
          <button className={`tab ${!scientific ? 'active' : ''}`} onClick={() => setScientific(false)}>
            Basic
          </button>
          <button className={`tab ${scientific ? 'active' : ''}`} onClick={() => setScientific(true)}>
            Scientific
          </button>
        </div>
      </div>

      {scientific && (
        <div className="calc-grid" style={{ marginBottom: 8 }}>
          {scientificButtons.map((b) => (
            <button key={b} className="calc-btn func" onClick={() => press(b)}>
              {b.replace('(', '')}
            </button>
          ))}
          <button className="calc-btn memory" onClick={memoryClear}>MC</button>
          <button className="calc-btn memory" onClick={memoryRecall}>MR</button>
          <button className="calc-btn memory" onClick={memoryAdd}>M+</button>
          <button className="calc-btn memory" onClick={memorySubtract}>M-</button>
        </div>
      )}

      <div className="calc-grid">
        {basicButtons.flat().map((b, i) => {
          const isOperator = ['/', '*', '-', '+'].includes(b);
          const isEquals = b === '=';
          function handleClick() {
            if (b === 'AC') clearAll();
            else if (b === '⌫') backspace();
            else if (b === '=') calculate();
            else press(b);
          }
          return (
            <button
              key={i}
              className={`calc-btn ${isEquals ? 'equals' : isOperator ? 'operator' : ''}`}
              onClick={handleClick}
            >
              {b}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calculator;
