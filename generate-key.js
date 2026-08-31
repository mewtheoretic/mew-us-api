const crypto = require("crypto");

function generateLicenseKey() {
  const part1 = crypto.randomBytes(4).toString("hex").toUpperCase();
  const part2 = crypto.randomBytes(4).toString("hex").toUpperCase();
  const part3 = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `BT-${part1}-${part2}-${part3}`;
}

module.exports = {
  generateLicenseKey
};
