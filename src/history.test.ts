import assert from "node:assert";
import { describe, it } from "node:test";
import { replay, generate } from "./history.js";

describe("replay", () => {
  it("returns an empty list when no entries are provided", () => {
    assert.deepStrictEqual(replay([]), []);
  });

  it("returns a current list of stargazers derived from the provided entries", () => {
    assert.deepStrictEqual(
      replay([
        {
          date: new Date("2024-01-23T08:41:12.000Z"),
          added: ["user7", "user8"],
          removed: ["user1", "user5"],
        },
        {
          date: new Date("2024-01-09T08:16:12.000Z"),
          added: [],
          removed: ["user3"],
        },
        {
          date: new Date("2024-01-02T08:59:36.000Z"),
          added: ["user1", "user2", "user3"],
          removed: [],
        },
        {
          date: new Date("2024-01-16T08:32:18.000Z"),
          added: ["user4", "user5", "user6"],
          removed: [],
        },
      ]),
      ["user2", "user4", "user6", "user7", "user8"],
    );
  });
});

describe("generate", () => {
  it("generates an entry by diffing the two stargazer lists", () => {
    const date = new Date("2024-01-16T08:32:18.000Z");
    assert.deepStrictEqual(
      generate(
        date,
        ["user1", "user2", "user3", "user4", "user5"],
        ["user1", "user2", "user4", "user6", "user7"],
      ),
      {
        date,
        added: ["user6", "user7"],
        removed: ["user3", "user5"],
      },
    );
  });
});
