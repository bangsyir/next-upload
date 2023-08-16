import multer from "multer";
import type { NextApiRequest, NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import sharp from "sharp";
import { join } from "path";

type NextApiRequestWithFiles = NextApiRequest & {
  files: any;
};

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

const router = createRouter<NextApiRequestWithFiles, NextApiResponse>();

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
      cb(null, file.originalname);
      req.next;
    },
  }),
});

const reduceImage = (destination: string, path: string) => {
  sharp(path)
    .resize(500)
    .jpeg()
    .toFile(join(process.cwd(), `${destination}/${crypto.randomUUID()}.jpg`));
};

router
  // @ts-ignore
  .use(upload.array("images"))
  .post(async (req, res) => {
    req.files.forEach((image: any) => {
      reduceImage(image.destination, image.path);
    });
    res.status(201).json({ message: "success" });
  });

export default router.handler();
