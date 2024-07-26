const fs = require("fs");
const path = require("path");
const { id } = require("../../jest.config");

async function files(currpath) {
  const data = fs.readdirSync(currpath, { withFileTypes: true });
  data.forEach((item) => {
    const filePath = path.join(currpath, item.name);

    const dt = fs.statSync(filePath);
    if (dt.isDirectory()) {
      files(filePath);
    } else {
      change(filePath);
    }
  });
}
function change(filePath) {
  const data = fs.readFileSync(filePath);
  const str = data.toString();
  console.log(filePath);
  const seqStr = "await sequelize.sync({ force: true });";
  const idx = str.indexOf(seqStr) + seqStr.length;
  const size = str.length;
  const ourStr = "await sequelize.close();";
  const first = str.slice(0, idx);
  const second = str.slice(idx, size - 1);
  const res = first + "\n    " + ourStr + second;
  fs.writeFileSync(filePath, res);
  i++;
}

function start() {
  files("./");
}

start();
