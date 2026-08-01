// Checks password against basic rules and returns a 0-4 score plus what's missing.

export function checkPassword(password) {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const isStrong = score === 4;

  const labels = ["Very weak", "Weak", "Okay", "Good", "Strong"];
  const colors = ["#F87171", "#F97316", "#FBBF24", "#84CC16", "#34D399"];

  return {
    checks,
    score,
    isStrong,
    label: labels[score],
    percent: (score / 4) * 100,
    color: colors[score],
  };
}
