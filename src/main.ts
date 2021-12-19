import * as fs from "fs";
import sha1 from "sha1";
import { createCanvas, loadImage, Image } from "canvas";
import UPNG from "upng-js";
import NETWORK from "./constants/network";
import {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  text,
  namePrefix,
  network,
  gif,
} from "./config";

import { HashLipsGiffer } from "./modules/HashlipsGiffer.js";

const basePath = process.cwd();

const buildDir = `${basePath}/build`;
const layersDir = `${basePath}/layers`;

const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");
// store the maxium number of frames
let frameCount = 0;
ctx.imageSmoothingEnabled = format.smoothing;
const metadataList = [];
let attributesList = [];
const dnaList = new Set();
const DNA_DELIMITER = "-";

let hashlipsGiffer = null;

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(`${buildDir}/json`);
  fs.mkdirSync(`${buildDir}/images`);
  if (gif.export) {
    fs.mkdirSync(`${buildDir}/gifs`);
  }
};

const getRarityWeight = (_str) => {
  const nameWithoutExtension = _str.slice(0, -4);
  let nameWithoutWeight = Number(
    nameWithoutExtension.split(rarityDelimiter).pop()
  );
  if (Number.isNaN(nameWithoutWeight)) {
    nameWithoutWeight = 1;
  }
  return nameWithoutWeight;
};

const cleanDna = (_str) => {
  const withoutOptions = removeQueryStrings(_str);
  const dna = Number(withoutOptions.split(":").shift());
  return dna;
};

const cleanName = (_str) => {
  const nameWithoutExtension = _str.slice(0, -4);
  const nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift();
  return nameWithoutWeight;
};

const getElements = (path) =>
  fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => ({
      id: index,
      name: cleanName(i),
      filename: i,
      path: `${path}${i}`,
      weight: getRarityWeight(i),
    }));

const layersSetup = (layersOrder) => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    name:
      layerObj.options?.displayName !== undefined
        ? layerObj.options?.displayName
        : layerObj.name,
    blend:
      layerObj.options?.blend !== undefined
        ? layerObj.options?.blend
        : "source-over",
    opacity:
      layerObj.options?.opacity !== undefined ? layerObj.options?.opacity : 1,
    bypassDNA:
      layerObj.options?.bypassDNA !== undefined
        ? layerObj.options?.bypassDNA
        : false,
  }));
  return layers;
};

const saveImage = (_editionCount: number, _buffers?: ArrayBuffer[]) => {
  if (_buffers === undefined) {
    fs.writeFileSync(
      `${buildDir}/images/${_editionCount}.png`,
      canvas.toBuffer("image/png")
    );
  } else {
    const png = UPNG.encode(
      _buffers,
      format.width,
      format.height,
      0,
      new Array(frameCount).fill(0)
    );
    fs.writeFileSync(
      `${buildDir}/images/${_editionCount}.png`,
      Buffer.from(png)
    );
  }
};

const genColor = () => {
  const hue = Math.floor(Math.random() * 360);
  const pastel = `hsl(${hue}, 100%, ${background.brightness})`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = background.static ? background.default : genColor();
  ctx.fillRect(0, 0, format.width, format.height);
};

const addMetadata = (_dna, _edition) => {
  const dateTime = Date.now();
  const tempMetadata = {
    name: `${namePrefix} #${_edition}`,
    description,
    file_url: `${baseUri}/${_edition}.png`,
    dna: sha1(_dna),
    edition: _edition,
    date: dateTime,
    ...extraMetadata,
    attributes: attributesList,
  };

  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttributes = (_element) => {
  const {
    selectedElement: { name },
  } = _element.layer;
  if (name.trim().toLowerCase() !== "blank") {
    attributesList.push({
      trait_type: _element.layer.name,
      value: name,
    });
  }
};

const loadLayerImg = async (_layer) =>
  new Promise(async (resolve) => {
    // load image using upng-js to support animated png
    const img = await UPNG.decode(
      fs.readFileSync(`${_layer.selectedElement.path}`)
    );
    const image: Image[] = [];
    // convert img to arraybuffers without MIME type
    const arrayBuffers = UPNG.toRGBA8(img);
    for (const frame of arrayBuffers) {
      const frameBuffer = Buffer.from(
        UPNG.encode([frame], img.width, img.height, 0)
      );
      const frameImage = await loadImage(frameBuffer);
      image.push(frameImage);
    }
    // decide frameCount
    frameCount = Math.max(frameCount, image.length);
    // const image = await loadImage(`${_layer.selectedElement.path}`);
    resolve({ layer: _layer, loadedImage: image });
  });

const addText = (_sig, x, y, size) => {
  ctx.fillStyle = text.color;
  ctx.font = `${text.weight} ${size}pt ${text.family}`;
  ctx.textBaseline = <CanvasTextBaseline>text.baseline;
  ctx.textAlign = <CanvasTextAlign>text.align;
  ctx.fillText(_sig, x, y);
};

// use upng-js to load the apng file
const drawElement = (_renderObject, _index, _layersLen, frameNum?: number) => {
  ctx.globalAlpha = _renderObject.layer.opacity;
  ctx.globalCompositeOperation = _renderObject.layer.blend;
  if (text.only) {
    addText(
      `${_renderObject.layer.name}${text.spacer}${_renderObject.layer.selectedElement.name}`,
      text.xGap,
      text.yGap * (_index + 1),
      text.size
    );
  } else {
    // handle frame count overflow
    if (frameNum > _renderObject.loadedImage.length - 1)
      frameNum = _renderObject.loadedImage.length - 1;

    ctx.drawImage(
      _renderObject.loadedImage[frameNum],
      0,
      0,
      format.width,
      format.height
    );
  }
};

const constructLayerToDna = (_dna = "", _layers = []) => {
  const mappedDnaToLayers = _layers.map((layer, index) => {
    const selectedElement = layer.elements.find(
      (e) => e.id === cleanDna(_dna.split(DNA_DELIMITER)[index])
    );
    return {
      name: layer.name,
      blend: layer.blend,
      opacity: layer.opacity,
      selectedElement,
    };
  });
  return mappedDnaToLayers;
};

interface Options {
  bypassDNA: string;
}

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param {String} _dna New DNA string
 * @returns new DNA string with any items that should be filtered, removed.
 */
const filterDNAOptions = (_dna) => {
  const dnaItems = _dna.split(DNA_DELIMITER);
  const filteredDNA = dnaItems.filter((element) => {
    const query = /(\?.*$)/;
    const querystring = query.exec(element);
    if (!querystring) {
      return true;
    }
    const options = querystring[1].split("&").reduce((r, setting) => {
      const keyPairs = setting.split("=");
      return { ...r, [keyPairs[0]]: keyPairs[1] };
    }, []);

    // CHanged this ->  return options.bypassDNA;
    // @ts-ignore
    return options.bypassDNA;
  });

  return filteredDNA.join(DNA_DELIMITER);
};

/**
 * Cleaning function for DNA strings. When DNA strings include an option, it
 * is added to the filename with a ?setting=value query string. It needs to be
 * removed to properly access the file name before Drawing.
 *
 * @param {String} _dna The entire newDNA string
 * @returns Cleaned DNA string without querystring parameters.
 */
const removeQueryStrings = (_dna) => {
  const query = /(\?.*$)/;
  return _dna.replace(query, "");
};

const isDnaUnique = (_DnaList = new Set(), _dna = "") => {
  const _filteredDNA = filterDNAOptions(_dna);
  return !_DnaList.has(_filteredDNA);
};

const createDna = (_layers) => {
  const randNum = [];
  _layers.forEach((layer) => {
    let totalWeight = 0;
    layer.elements.forEach((element) => {
      totalWeight += element.weight;
    });
    // number between 0 - totalWeight
    let random = Math.floor(Math.random() * totalWeight);
    for (let i = 0; i < layer.elements.length; i++) {
      // subtract the current weight from the random weight until we reach a sub zero value.
      random -= layer.elements[i].weight;
      if (random < 0) {
        return randNum.push(
          `${layer.elements[i].id}:${layer.elements[i].filename}${
            layer.bypassDNA ? "?bypassDNA=true" : ""
          }`
        );
      }
    }
  });
  return randNum.join(DNA_DELIMITER);
};

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);
};

const saveMetaDataSingleFile = (_editionCount) => {
  const metadata = metadataList.find((meta) => meta.edition == _editionCount);
  debugLogs
    ? console.log(
        `Writing metadata for ${_editionCount}: ${JSON.stringify(metadata)}`
      )
    : null;
  fs.writeFileSync(
    `${buildDir}/json/${_editionCount}.json`,
    JSON.stringify(metadata, null, 2)
  );
};

function shuffle(array) {
  let currentIndex = array.length;
  let randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const startCreating = async () => {
  let layerConfigIndex = 0;
  let editionCount = 1;
  let failedCount = 0;
  let abstractedIndexes = [];
  for (
    let i = network == NETWORK.sol ? 0 : 1;
    i <= layerConfigurations[layerConfigurations.length - 1].growEditionSizeTo;
    i++
  ) {
    abstractedIndexes.push(i);
  }
  if (shuffleLayerConfigurations) {
    abstractedIndexes = shuffle(abstractedIndexes);
  }
  debugLogs
    ? console.log("Editions left to create: ", abstractedIndexes)
    : null;
  while (layerConfigIndex < layerConfigurations.length) {
    const layers = layersSetup(
      layerConfigurations[layerConfigIndex].layersOrder
    );
    while (
      editionCount <= layerConfigurations[layerConfigIndex].growEditionSizeTo
    ) {
      const newDna = createDna(layers);
      if (isDnaUnique(dnaList, newDna)) {
        const results = constructLayerToDna(newDna, layers);
        const loadedElements = [];
        results.forEach((layer) => {
          loadedElements.push(loadLayerImg(layer));
          // loadedElements.push(loadLayerImgData(layer));
        });

        // buffers contains all frames of the animation
        let buffers: ArrayBuffer[] = [];

        if (gif.export) {
          hashlipsGiffer = new HashLipsGiffer(
            canvas,
            ctx,
            `${buildDir}/gifs/${abstractedIndexes[0]}.gif`,
            gif.repeat,
            gif.quality,
            gif.delay
          );
          hashlipsGiffer.start();
        }
        if (background.generate) {
          drawBackground();
        }

        if (gif.export) {
          hashlipsGiffer.stop();
        }

        debugLogs
          ? console.log("Editions left to create: ", abstractedIndexes)
          : null;
        // wait until all render objects has been loaded
        const renderObjectArray = await Promise.all(loadedElements);
        // for each frame render all the layers
        for (let i = 0; i < frameCount; i++) {
          debugLogs ? console.log("Clearing canvas") : null;
          ctx.clearRect(0, 0, format.width, format.height);
          // renders each object
          renderObjectArray.forEach((renderObject, index) => {
            drawElement(
              renderObject,
              index,
              layerConfigurations[layerConfigIndex].layersOrder.length,
              i
            );
          });
          // push current rendered frame into buffer
          buffers.push(
            ctx.getImageData(0, 0, format.width, format.height).data.buffer
          );
        }
        renderObjectArray.forEach((renderObject, index) => {
          addAttributes(renderObject);
        });
        saveImage(abstractedIndexes[0], buffers);
        addMetadata(newDna, abstractedIndexes[0]);
        saveMetaDataSingleFile(abstractedIndexes[0]);
        console.log(
          `Created edition: ${abstractedIndexes[0]}, with DNA: ${
            metadataList[metadataList.length - 1].dna
          }`
        );

        dnaList.add(filterDNAOptions(newDna));
        editionCount++;
        abstractedIndexes.shift();
      } else {
        console.log("DNA exists!");
        failedCount++;
        if (failedCount >= uniqueDnaTorrance) {
          console.log(
            `You need more layers or elements to grow your edition to ${layerConfigurations[layerConfigIndex].growEditionSizeTo} artworks!`
          );
          process.exit();
        }
      }
    }
    layerConfigIndex++;
  }
  writeMetaData(JSON.stringify(metadataList, null, 2));
};

// module.exports = { startCreating, buildSetup, getElements };
export { startCreating, buildSetup, getElements };
