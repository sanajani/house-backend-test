import 'dotenv/config';
import axios from "axios";
import sharp from "sharp";
import mime from 'mime-types';


const STORAGE_ZONE = "propertiesimages";
const STORAGE_REGION = "sg"; // change if different
const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;

const CDN_HOST = "https://propertiesimagespullzone.b-cdn.net";
export const uploadImagesToBunny = async (propertyId, files) => {
    
    let uploadedImages = []

    for (const file of files){
        const optimizedBuffer = await sharp(file.buffer)
            .resize({width: 1600})
            .webp({quality: 80})
            .toBuffer()
        
        const fileName = `${Date.now()}-${Math.round(Math.random()*1e9)}.webp`

        const storagePath = `properties/${propertyId}/${fileName}`
 
        const uploadUrl = `https://${STORAGE_REGION}.storage.bunnycdn.com/${STORAGE_ZONE}/${storagePath}`;

        const contentType = mime.lookup("webp") || "application/octet-stream";


        const resp = await axios.put(uploadUrl, optimizedBuffer, {
      headers: {
        AccessKey: ACCESS_KEY,
        "Content-Type": contentType
      }
    });

if (![200, 201].includes(resp.status)) {
  throw new Error("Upload failed");
}


    // 🔥 build CDN URL
    const cdnUrl = `${CDN_HOST}/${storagePath}`;

    uploadedImages.push({
      url: cdnUrl,
      fileName
    });
}
return uploadedImages;

}