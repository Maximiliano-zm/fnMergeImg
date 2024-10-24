import sharp from "sharp";
import { Buffer } from "buffer";

const resizeImage = async (buffer, width, height) => {
  return await sharp(buffer).resize(width, height).toBuffer();
};

const mergeImage = async (buffer1, buffer2) => {
  return (
    await sharp(buffer1)
      .composite([{ input: buffer2 }])
      .toBuffer()
  ).toString("base64");
};

const Imgs = async (content1, content2) => {
  try {
    const content1Data = content1.split(";base64,").pop();
    const content2Data = content2.split(";base64,").pop();

    let buffer1 = Buffer.from(content1Data, "base64"); // Imagen Base
    let buffer2 = Buffer.from(content2Data, "base64"); // Imagen Overlay

    const metadata = await sharp(buffer1).metadata();
    if (metadata.width !== 480 && metadata.height !== 640) {
      buffer2 = await resizeImage(buffer2, 640, 480);
    } else {
      buffer2 = await resizeImage(buffer2, 480, 640);
    }

    // merge img
    const returnData = await mergeImage(buffer1, buffer2);

    return returnData;
  } catch (error) {
    console.error("Error al fusionar imagenes:", error);
    throw new Error("Error al fusionar imagenes");
  }
};

const mergeImg = async (request) => {
  const imagenes = request;
  try {
    const content1 = imagenes.img1["$content"];
    const content2 = imagenes.img2["$content"];
    const mergeImgsB64 = await Imgs(content1, content2);
    return mergeImgsB64;
  } catch (error) {
    console.error("Error en mergeImg:", error);
    throw new Error("Error en el servicio de fusion de imagenes");
  }
};

export default mergeImg;
