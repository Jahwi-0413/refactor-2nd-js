const invoices = require("./invoices.json");
const plays = require("./plays.json");

const before = require("./before");
const after = require("./after");

test("compare statement function between before version with after version", () => {
  expect(after.statement(invoices[0], plays)).toBe(
    before.statement(invoices[0], plays)
  );
});
