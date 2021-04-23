/* eslint-env jest */
import render from "./render.js";

test("should add title tag", () => {
  const result = render({ title: "My title" });
  expect(result).toContain("<title>My title</title>");
});
