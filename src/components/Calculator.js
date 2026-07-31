import { useState } from 'react';
import { supabase } from '../supabaseClient';

function Calculator({ user, onNewCalculation }) {
  const [display, setDisplay] = useState('');

  function pressButton(value) {
    setDisplay(display + value);
  }

  function clearDisplay() {
    setDisplay('');
  }

  async function calculateResult() {
    if (display.trim() === '') return;

    // only allow safe math characters
    const isSafe = /^[0-9+\-*/(). ]+$/.test(display);
    if (!isSafe) {
      setDisplay('Error');
      return;
    }

    let result;
    try {
      // eslint-disable-next-line no-eval
      result = eval(display).toString();
    } catch {
      setDisplay('Error');
      return;
    }

    setDisplay(result);

    await supabase.from('calculations').insert({
      user_id: user.id,
      expression: display,
      result,
    });

    onNewCalculation();
  }

  const buttonRows = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', 'C', '+'],
  ];

  return (
    <div className="calculator">
      <div className="calculator-screen">{display || '0'}</div>

      <div className="calculator-buttons">
        {buttonRows.map((row, i) => (
          <div className="calculator-row" key={i}>
            {row.map((button) => (
              <button
                key={button}
                onClick={() => (button === 'C' ? clearDisplay() : pressButton(button))}
              >
                {button}
              </button>
            ))}
          </div>
        ))}
        <button className="equals-button" onClick={calculateResult}>
          =
        </button>
      </div>
    </div>
  );
}

export default Calculator;
