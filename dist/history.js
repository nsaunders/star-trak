export function replay(entries) {
    return entries
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
        .reduce((acc, entry) => acc.filter(x => !entry.removed.includes(x)).concat(entry.added), []);
}
export function generate(date, previous, next) {
    return {
        date,
        added: next.filter(n => !previous.some(p => p === n)),
        removed: previous.filter(p => !next.some(n => n === p)),
    };
}
