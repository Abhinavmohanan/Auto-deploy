const getNewLines = (oldlogs: string, newlogs: string) => {
  const oldlogsArray = oldlogs.split("\n");
  const newlogsArray = newlogs.split("\n");
  const newLines = newlogsArray.filter((log) => !oldlogsArray.includes(log));
  return newLines;
};

const printLines = (lines: string[]) => {
  lines.forEach((line) => {
    console.log(line);
  });
};

export { getNewLines, printLines };
