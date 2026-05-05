
export type HistoryItem = {
  expression: string;
  result: number;
  timestamp: number;
};

class CalculatorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CalculatorError";
  }
}

interface CalcValue {
  value: number;
  isPercent: boolean;
}

const ALLOWED_FUNCTIONS: Record<string, (...args: number[]) => number> = {
  abs: Math.abs,
  sqrt: Math.sqrt,
  pow: Math.pow,
  mod: (a, b) => a % b,
};

export class CalculatorEngine {
  private tokens: string[] = [];
  private index = 0;
  private tokenRe = /\s*(\d+(?:\.\d+)?|\.\d+|[A-Za-z_]\w*|\*\*|[()+\-*/%,])/g;

  evaluate(expression: string): number {
    const text = expression.trim();
    if (!text) throw new CalculatorError("Empty input");

    this.tokens = this.tokenize(text);
    this.index = 0;

    const result = this.parseExpr();
    if (this.peek() !== null) {
      throw new CalculatorError("Unexpected token");
    }
    return result.value;
  }

  private tokenize(text: string): string[] {
    const tokens: string[] = [];
    let match;
    this.tokenRe.lastIndex = 0;
    while ((match = this.tokenRe.exec(text)) !== null) {
      tokens.push(match[1]);
      if (this.tokenRe.lastIndex === match.index) this.tokenRe.lastIndex++;
    }
    
    return tokens;
  }

  private peek(): string | null {
    if (this.index >= this.tokens.length) return null;
    return this.tokens[this.index];
  }

  private consume(expected?: string): string {
    const token = this.peek();
    if (token === null) throw new CalculatorError("Unexpected end of expression");
    if (expected !== undefined && token !== expected) {
      throw new CalculatorError(`Expected ${expected} but found ${token}`);
    }
    this.index++;
    return token;
  }

  private parseExpr(): CalcValue {
    let left = this.parseTerm();
    while (this.peek() === "+" || this.peek() === "-") {
      const op = this.consume();
      const right = this.parseTerm();
      if (op === "+") {
        if (right.isPercent) {
          left = { value: left.value + left.value * right.value, isPercent: false };
        } else {
          left = { value: left.value + right.value, isPercent: false };
        }
      } else {
        if (right.isPercent) {
          left = { value: left.value - left.value * right.value, isPercent: false };
        } else {
          left = { value: left.value - right.value, isPercent: false };
        }
      }
    }
    return left;
  }

  private parseTerm(): CalcValue {
    let left = this.parsePower();
    while (this.peek() === "*" || this.peek() === "/") {
      const op = this.consume();
      const right = this.parsePower();
      if (op === "*") {
        left = { value: left.value * right.value, isPercent: false };
      } else {
        if (right.value === 0) throw new CalculatorError("Division by zero");
        left = { value: left.value / right.value, isPercent: false };
      }
    }
    return left;
  }

  private parsePower(): CalcValue {
    let left = this.parseUnary();
    if (this.peek() === "**") {
      this.consume("**");
      const right = this.parsePower();
      left = { value: Math.pow(left.value, right.value), isPercent: false };
    }
    return left;
  }

  private parseUnary(): CalcValue {
    const token = this.peek();
    if (token === "+") {
      this.consume("+");
      return this.parseUnary();
    }
    if (token === "-") {
      this.consume("-");
      const value = this.parseUnary();
      return { value: -value.value, isPercent: value.isPercent };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): CalcValue {
    let token = this.peek();
    if (token === null) throw new CalculatorError("Unexpected end of expression");

    let value: CalcValue;

    if (token === "(") {
      this.consume("(");
      value = this.parseExpr();
      this.consume(")");
    } else if (/^\d+(?:\.\d+)?|\.\d+$/.test(token)) {
      this.consume();
      value = { value: parseFloat(token), isPercent: false };
    } else if (/^[A-Za-z_]\w*$/.test(token)) {
      const name = this.consume();
      value = this.parseFunction(name);
    } else {
      throw new CalculatorError(`Invalid token: ${token}`);
    }

    while (this.peek() === "%") {
      this.consume("%");
      value = { value: value.value / 100.0, isPercent: true };
    }
    return value;
  }

  private parseFunction(name: string): CalcValue {
    if (!(name in ALLOWED_FUNCTIONS)) {
      throw new CalculatorError(`Function '${name}' is not supported`);
    }
    this.consume("(");
    const args: number[] = [];
    if (this.peek() !== ")") {
      while (true) {
        const arg = this.parseExpr();
        args.push(arg.value);
        if (this.peek() === ",") {
          this.consume(",");
          continue;
        }
        break;
      }
    }
    this.consume(")");
    try {
      const result = ALLOWED_FUNCTIONS[name](...args);
      if (isNaN(result)) throw new CalculatorError("Invalid result");
      return { value: result, isPercent: false };
    } catch (e) {
      if (e instanceof CalculatorError) throw e;
      throw new CalculatorError("Function execution error");
    }
  }
}
