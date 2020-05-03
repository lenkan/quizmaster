/* eslint-env jest */
const render = require("./render");

test("should add title tag", () => {
  const result = render({ title: "My title" });
  expect(result).toContain("<title>My title</title>");
});
