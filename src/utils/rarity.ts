import * as fs from "fs";

import { layerConfigurations } from "../config.js";

import { getElements } from "../main.js";

const basePath = process.cwd();
const layersDir = `${basePath}/layers`;

// read json data
const rawdata = fs
  .readFileSync(`${basePath}/build/json/_metadata.json`)
  .toString();
const data = JSON.parse(rawdata);
const editionSize = data.length;

const rarityData = [];

// intialize layers to chart
layerConfigurations.forEach((config) => {
  const layers = config.layersOrder;

  layers.forEach((layer) => {
    // get elements for each layer
    const elementsForLayer = [];
    const elements = getElements(`${layersDir}/${layer.name}/`);
    elements.forEach((element) => {
      // just get name and weight for each element
      const rarityDataElement = {
        trait: element.name,
        weight: element.weight.toFixed(0),
        occurrence: 0, // initialize at 0
      };
      elementsForLayer.push(rarityDataElement);
    });

    const layerName: string =
      // @ts-ignore
      layer.options.displayName !== undefined
        ? // @ts-ignore
          layer.options.displayName
        : layer.name;
    // don't include duplicate layers
    if (!rarityData.includes(layer.name)) {
      // add elements for each layer to chart
      rarityData[layerName] = elementsForLayer;
    }
  });
});

// fill up rarity chart with occurrences from metadata
data.forEach((element) => {
  const { attributes } = element;
  attributes.forEach((attribute) => {
    const traitType = attribute.trait_type;
    const { value } = attribute;

    const rarityDataTraits = rarityData[traitType];
    rarityDataTraits.forEach((rarityDataTrait) => {
      if (rarityDataTrait.trait == value) {
        // keep track of occurrences
        rarityDataTrait.occurrence++;
      }
    });
  });
});

// convert occurrences to occurence string
for (var layer in rarityData) {
  for (const attribute in rarityData[layer]) {
    // get chance
    const chance = (
      (rarityData[layer][attribute].occurrence / editionSize) *
      100
    ).toFixed(2);

    // show two decimal places in percent
    rarityData[layer][
      attribute
    ].occurrence = `${rarityData[layer][attribute].occurrence} in ${editionSize} editions (${chance} %)`;
  }
}

// print out rarity data
for (var layer in rarityData) {
  console.log(`Trait type: ${layer}`);
  for (const trait in rarityData[layer]) {
    console.log(rarityData[layer][trait]);
  }
  console.log();
}
