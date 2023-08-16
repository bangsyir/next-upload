import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import formidable from "formidable";
import sharp from "sharp";
import { join } from "path";
import { access, unlinkSync } from "fs";

const router = createRouter<NextApiRequest, NextApiResponse>();

const reduceImage = (
  destination: string,
  path: string,
  newFileName: string
) => {
  sharp(path)
    .resize(500)
    .jpeg()
    .toFile(
      join(process.cwd(), `${destination}/${newFileName.split(".")[0]}.jpg`)
    )
    .then(() => {
      access(`${destination}/${newFileName}`, () => {
        unlinkSync(`${destination}/${newFileName}`);
      });
    });
};

router.post(async (req, res) => {
  const form = formidable({
    uploadDir: "./public/uploads",
    filename: () => crypto.randomUUID(),
    keepExtensions: true,
    createDirsFromUploads: true,
  });
  const formData = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      files.images.map((image) =>
        reduceImage(
          "./public/uploads",
          `./public/uploads/${image.newFilename}`,
          image.newFilename
        )
      );
      console.log({ fields, files: JSON.stringify(files, null, 2) });
      console.log(fields.title[0]);
      resolve({ fields, files });
    });
  });
  res.status(201).json(formData);
});

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default router.handler();
