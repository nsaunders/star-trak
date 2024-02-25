import { Entry } from "./entry.js";

export function replay(entries: Entry[]) {
  return entries
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .reduce(
      (acc, entry) =>
        acc.filter(x => !entry.removed.includes(x)).concat(entry.added),
      [] as string[],
    );
}

export function generate(date: Date, previous: string[], next: string[]) {
  return {
    date,
    added: next.filter(n => !previous.some(p => p === n)),
    removed: previous.filter(p => !next.some(n => n === p)),
  };
}
