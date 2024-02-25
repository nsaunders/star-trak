import fs from "node:fs/promises";
import core from "@actions/core";
import { z } from "zod";
import * as Entry from "./entry.js";
import { generate, replay } from "./history.js";
import path from "node:path";
const inputs = {
    path: core.getInput("path"),
    repo: core.getInput("repo"),
    token: core.getInput("token"),
};
async function getEntries() {
    try {
        await fs.access(inputs.path, fs.constants.F_OK);
    }
    catch (_a) {
        return [];
    }
    return z
        .array(Entry.schema)
        .parse(JSON.parse(await fs.readFile(inputs.path, "utf8")));
}
async function writeEntries(entries) {
    await fs.mkdir(path.dirname(inputs.path), { recursive: true });
    await fs.writeFile(inputs.path, JSON.stringify(entries, null, 2));
}
async function listStargazers(page = 1) {
    const res = await fetch(`https://api.github.com/repos/${inputs.repo}/stargazers?per_page=100&page=${page}`);
    const list = z
        .array(z.object({ login: z.string() }))
        .parse(await res.json())
        .map(({ login }) => login);
    if (list.length < 100) {
        return list;
    }
    return [...list, ...(await listStargazers(page + 1))];
}
["path", "repo", "token"].forEach(input => {
    if (!inputs[input]) {
        throw new Error(`Missing input: ${input}`);
    }
});
const entries = await getEntries();
const previousStargazers = replay(entries);
const nextStargazers = await listStargazers();
entries.push(generate(new Date(), previousStargazers, nextStargazers));
writeEntries(entries);
process.stdout.write("Stargazers updated successfully.");
