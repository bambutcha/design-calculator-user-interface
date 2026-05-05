import { describe, expect, it } from "vitest";
import { CalculatorEngine } from "./calculator";

describe("CalculatorEngine", () => {
  const engine = new CalculatorEngine();

  it("calculates basic operations with precedence", () => {
    expect(engine.evaluate("2 + 3 * 4")).toBe(14);
    expect(engine.evaluate("(2 + 3) * 4")).toBe(20);
    expect(engine.evaluate("2**3**2")).toBe(512);
  });

  it("supports calculator-style percent mode", () => {
    expect(engine.evaluate("10%")).toBe(0.1);
    expect(engine.evaluate("200+10%")).toBe(220);
    expect(engine.evaluate("200-10%")).toBe(180);
    expect(engine.evaluate("200*10%")).toBe(20);
    expect(engine.evaluate("200/10%")).toBe(2000);
  });

  it("supports available functions", () => {
    expect(engine.evaluate("abs(-5)")).toBe(5);
    expect(engine.evaluate("sqrt(81)")).toBe(9);
    expect(engine.evaluate("pow(2,10)")).toBe(1024);
    expect(engine.evaluate("mod(10,3)")).toBe(1);
  });

  it("throws on division by zero", () => {
    expect(() => engine.evaluate("1/0")).toThrow("Division by zero");
  });

  it("throws on malformed expressions", () => {
    expect(() => engine.evaluate("2+")).toThrow();
    expect(() => engine.evaluate("sin(1)")).toThrow("is not supported");
    expect(() => engine.evaluate("2@2")).toThrow("Invalid token");
  });
});
