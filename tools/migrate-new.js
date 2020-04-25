const fs = require("fs");

const name = process.argv[2];
if (!name) {
  console.log(`Usage: ${process.argv[1]} <name>`);
  process.exit(1);
}

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const now = new Date();
const timestamp = [
  pad(now.getUTCFullYear(), 4),
  pad(now.getUTCMonth() + 1, 2),
  pad(now.getUTCDate(), 2),
  pad(now.getUTCHours(), 2),
  pad(now.getUTCMinutes(), 2),
  pad(now.getUTCSeconds(), 2),
].join("");

fs.writeFileSync(`migrations/${timestamp}_${name}.pssql`, "\n");
