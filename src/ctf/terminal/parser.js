export const tokenizeCommand = (raw) => {
  const tokens = [];
  let current = "";
  let quote = null;
  let escaped = false;

  for (const char of raw) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === "\\" && quote !== "'") {
      escaped = true;
      continue;
    }

    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
      }
      continue;
    }

    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    current += char;
  }

  if (current) tokens.push(current);
  return tokens;
};

export const parseCommand = (rawCommand) => {
  const raw = rawCommand.trim();
  const args = raw ? tokenizeCommand(raw) : [];
  const canonical = args.join(" ");

  return {
    raw,
    args,
    canonical,
    canonicalLower: canonical.toLowerCase(),
    command: args[0]?.toLowerCase() || "",
  };
};
