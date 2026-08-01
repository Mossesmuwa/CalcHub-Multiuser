import { evaluateExpression } from "./mathEngine";

test("adds two numbers", () => {
  expect(evaluateExpression("2+2")).toEqual({ value: "4" });
});

test("respects order of operations", () => {
  expect(evaluateExpression("2+3*4")).toEqual({ value: "14" });
});

test("handles parentheses", () => {
  expect(evaluateExpression("(2+3)*4")).toEqual({ value: "20" });
});

test("catches divide by zero", () => {
  expect(evaluateExpression("5/0")).toEqual({ error: "Can't divide by zero" });
});

test("catches mismatched parentheses", () => {
  expect(evaluateExpression("(2+3")).toEqual({
    error: "Check your parentheses",
  });
});

test("sin(90) is 1 in degree mode", () => {
  const { value } = evaluateExpression("sin(90)", "deg");
  expect(Number(value)).toBeCloseTo(1);
});

test("sin(90) is not 1 in radian mode", () => {
  const { value } = evaluateExpression("sin(90)", "rad");
  expect(Number(value)).not.toBeCloseTo(1);
});

test("square root works", () => {
  expect(evaluateExpression("√(16)")).toEqual({ value: "4" });
});

test("percentage divides by 100", () => {
  expect(evaluateExpression("50%")).toEqual({ value: "0.5" });
});

test("rejects gibberish instead of crashing", () => {
  expect(evaluateExpression("2++*3")).toEqual({
    error: "That doesn't compute",
  });
});
