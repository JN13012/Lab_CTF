export const parseCommand = (rawCommand) => {
  const raw = rawCommand.trim();
  const args = raw ? raw.split(/\s+/) : [];

  return {
    raw,
    args,
    command: args[0]?.toLowerCase() || "",
  };
};
