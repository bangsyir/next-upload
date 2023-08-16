import axios from "@/lib/axios";
import Image from "next/image";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  title: string;
  images: FileList;
};

export default function Formidable() {
  const [images, setImages] = React.useState<any[]>();
  const { register, handleSubmit, watch } = useForm<Inputs>();

  const files = watch("images");

  React.useEffect(() => {
    if (files && files.length !== 0) {
      const selectedFile: React.SetStateAction<string[] | undefined> = [];
      const targetFilesObject = [...files];
      targetFilesObject.map((file) => {
        return selectedFile.push(URL.createObjectURL(file));
      });
      setImages(selectedFile);
    }
  }, [files]);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const form = new FormData();
    form.append("title", data.title);
    const selectedImages = [...data.images];
    selectedImages.map((image) => form.append("images", image));
    await axios
      .post("/formidable", form, {
        headers: {
          "Content-Type": "multpart/form-data",
        },
      })
      .then((res) => res.data)
      .catch((error) => console.log(error));
    return;
  };
  return (
    <main className="container mx-auto">
      <h1 className="text-xl">Formidable</h1>
      <form
        method="post"
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <div className="flex flex-col">
          <label htmlFor="title">image</label>
          <input
            type="text"
            multiple
            {...register("title")}
            className="text-neutral-900 rounded-md px-2 py-1"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="images">images</label>
          <input type="file" multiple {...register("images")} />
        </div>
        <div className="pt-4">
          <button className="border rounded-md bg-white text-neutral-900 px-4">
            Submit
          </button>
        </div>
      </form>
      {images ? (
        <div className="flex gap-4 pt-4">
          {images.map((image, index) => (
            <div
              className="rounded-md border w-[150px] h-[150px] flex items-center"
              key={index}
            >
              <Image
                src={image}
                height={150}
                width={150}
                alt="image"
                className="rounded-md"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="pt-4">
          <div className="w-[150px] h-[150px] rounded-md border">image</div>
        </div>
      )}
    </main>
  );
}
