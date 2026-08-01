import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { evaluateExpression } from "../utils/mathEngine";
import { BackspaceIcon } from "./Icons";

function Calculator({ user, onSaved }) {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [justCalculated, setJustCalculated] = useState(false);
  const [scientific, setScientific] = useState(false);
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState("deg");
  const [showShortcuts, setShowShortcuts] = useState(false);

  function press(value) {
    const base =
      justCalculated && !"+-*/^".includes(value)
        ? ""
        : justCalculated
          ? result
          : expression;

    // stop a second decimal point landing in the same number
    if (value === ".") {
      const currentNumber = base.match(/[0-9.]*$/)[0];
      if (currentNumber.includes(".")) return;
    }

    setExpression(base + value);
    setJustCalculated(false);
    setResult("");
  }

  function clearAll() {
    setExpression("");
    setResult("");
    setJustCalculated(false);
  }

  function backspace() {
    setExpression(expression.slice(0, -1));
  }

  async function calculate() {
    if (!expression) return;

    const { value, error: mathError } = evaluateExpression(
      expression,
      angleMode,
    );

    if (mathError) {
      setResult(mathError);
      setJustCalculated(true);
      return;
    }

    setResult(value);
    setJustCalculated(true);

    const { error } = await supabase.from("calculations").insert({
      user_id: user.id,
      expression,
      result: value,
    });
    if (!error) onSaved();
  }

  // memory buttons
  function memoryClear() {
    setMemory(0);
  }
  function memoryRecall() {
    press(memory.toString());
  }
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
      else if (e.key === "Enter") calculate();
      else if (e.key === "Backspace") backspace();
      else if (e.key === "Escape") clearAll();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const basicButtons = [
    ["AC", "(", ")", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "back", "="],
  ];

  const scientificButtons = [
    "sin(",
    "cos(",
    "tan(",
    "√(",
    "log(",
    "ln(",
    "^",
    "π",
    "%",
  ];

  return (
    <div className="card calculator">
      <div className="calc-top-row">
        {scientific && (
          <button
            className="angle-toggle"
            onClick={() => setAngleMode(angleMode === "deg" ? "rad" : "deg")}
          >
            {angleMode.toUpperCase()}
          </button>
        )}
        <button
          className="shortcuts-toggle"
          onClick={() => setShowShortcuts(!showShortcuts)}
          aria-label="Keyboard shortcuts"
        >
          ?
        </button>
      </div>

      {showShortcuts && (
        <div className="shortcuts-panel">
          <div>
            <kbd>0-9</kbd> numbers
          </div>
          <div>
            <kbd>+ - * /</kbd> operators
          </div>
          <div>
            <kbd>Enter</kbd> calculate
          </div>
          <div>
            <kbd>Backspace</kbd> delete
          </div>
          <div>
            <kbd>Esc</kbd> clear all
          </div>
        </div>
      )}

      <div className="calc-screen">
        <div className="calc-expression">{expression || " "}</div>
        <div className="calc-result" key={result || expression}>
          {result || expression || "0"}
        </div>
      </div>

      <div className="calc-mode-toggle">
        <div className="tabs" style={{ width: "100%" }}>
          <button
            className={`tab ${!scientific ? "active" : ""}`}
            onClick={() => setScientific(false)}
          >
            Basic
          </button>
          <button
            className={`tab ${scientific ? "active" : ""}`}
            onClick={() => setScientific(true)}
          >
            Scientific
          </button>
        </div>
      </div>

      {scientific && (
        <div
          className="calc-grid calc-scientific-panel"
          style={{ marginBottom: 8 }}
        >
          {scientificButtons.map((b) => (
            <button key={b} className="calc-btn func" onClick={() => press(b)}>
              {b.replace("(", "")}
            </button>
          ))}
          <button className="calc-btn memory" onClick={memoryClear}>
            MC
          </button>
          <button className="calc-btn memory" onClick={memoryRecall}>
            MR
          </button>
          <button className="calc-btn memory" onClick={memoryAdd}>
            M+
          </button>
          <button className="calc-btn memory" onClick={memorySubtract}>
            M-
          </button>
        </div>
      )}

      <div className="calc-grid">
        {basicButtons.flat().map((b, i) => {
          const isOperator = ["/", "*", "-", "+"].includes(b);
          const isEquals = b === "=";
          function handleClick() {
            if (b === "AC") clearAll();
            else if (b === "back") backspace();
            else if (b === "=") calculate();
            else press(b);
          }
          return (
            <button
              key={i}
              className={`calc-btn ${isEquals ? "equals" : isOperator ? "operator" : ""}`}
              onClick={handleClick}
            >
              {b === "back" ? <BackspaceIcon /> : b}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calculator;
