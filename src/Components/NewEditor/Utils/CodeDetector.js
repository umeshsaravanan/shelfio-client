export const codeDetector = (code) => {
  // Trim leading/trailing spaces
  code = code.trim();

  // Python detection (common keywords like def, import, class)
  if (/^\s*(def |import |from |class )/.test(code)) return "python";

  // JavaScript detection (function, const, let, var)
  if (/\b(function |const |let |var )/.test(code)) return "javascript";

  // C++ detection (#include, int main)
  if (code.includes("#include") || code.includes("int main(")) return "cpp";

  // Java detection (public class, main method)
  if (/public\s+class\s+\w+/.test(code)) return "java";

  // Go detection (package main, func main)
  if (/^\s*package\s+main/.test(code)) return "go";

  // Rust detection (fn main)
  if (/^\s*fn\s+\w+/.test(code)) return "rust";

  // TypeScript detection (interface, type)
  if (/\b(interface |type )/.test(code)) return "typescript";

  // SQL detection (SELECT, FROM, WHERE)
  if (/\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE)\b/i.test(code)) return "sql";

  return "plaintext"; // Default if no language is detected
};
