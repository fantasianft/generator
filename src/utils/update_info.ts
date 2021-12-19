import * as fs from "fs";
import NETWORK from "../constants/network.js";

import { baseUri, description, namePrefix } from "../config.js";

const basePath = process.cwd();

// read json data
const rawdata = fs
  .readFileSync(`${basePath}/build/json/_metadata.json`)
  .toString();
const data = JSON.parse(rawdata);

data.forEach((item) => {
  item.name = `${namePrefix} #${item.edition}`;
  item.description = description;
  item.image = `${baseUri}/${item.edition}.png`;

  fs.writeFileSync(
    `${basePath}/build/json/${item.edition}.json`,
    JSON.stringify(item, null, 2)
  );
});

fs.writeFileSync(
  `${basePath}/build/json/_metadata.json`,
  JSON.stringify(data, null, 2)
);

console.log(`Updated baseUri for images to ===> ${baseUri}`);
console.log(`Updated description for images to ===> ${description}`);
console.log(`Updated name prefix for images to ===> ${namePrefix}`);
