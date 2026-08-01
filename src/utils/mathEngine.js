// The calculator's actual math logic, pulled out on its own so it can be
// tested without rendering any React components.

function sinD(deg) {
  return Math.sin((deg * Math.PI) / 180);
}
function cosD(deg) {
  return Math.cos((deg * Math.PI) / 180);
}
function tanD(deg) {
  return Math.tan((deg * Math.PI) / 180);
}

export function toJsExpression(expr, angleMode = "deg") {
  const useDegrees = angleMode === "deg";
  return expr
    .replace(/π/g, "Math.PI")
    .replace(/√\(/g, "Math.sqrt(")
    .replace(/sin\(/g, useDegrees ? "sinD(" : "Math.sin(")
    .replace(/cos\(/g, useDegrees ? "cosD(" : "Math.cos(")
    .replace(/tan\(/g, useDegrees ? "tanD(" : "Math.tan(")
    .replace(/ln\(/g, "Math.log(")
    .replace(/log\(/g, "Math.log10(")
    .replace(/\^/g, "**")
    .replace(/%/g, "/100");
}

// Returns { value } on success or { error } on failure - never throws,
// so the calculator UI can just check which one it got back.
export function evaluateExpression(expr, angleMode = "deg") {
  if (!expr) return { error: "Empty expression" };

  const openParens = (expr.match(/\(/g) || []).length;
  const closeParens = (expr.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    return { error: "Check your parentheses" };
  }

  let value;
  try {
    // eslint-disable-next-line no-eval
    value = eval(toJsExpression(expr, angleMode));
  } catch {
    return { error: "That doesn't compute" };
  }

  if (Number.isNaN(value)) return { error: "That doesn't compute" };
  if (!isFinite(value)) return { error: "Can't divide by zero" };

  value = Math.round(value * 1e10) / 1e10; // trim floating point noise
  return { value: value.toString() };
}
