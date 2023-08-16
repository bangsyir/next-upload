import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto flex flex-1 flex-col items-center justify-center">
      <h1 className="text-xl">Image Upload</h1>
      <div className="flex gap-4">
        <Link href={"/multer"} className="border px-4">
          Multer
        </Link>
        <Link href={"/formidable"} className="border px-4">
          formidable
        </Link>
      </div>
    </main>
  );
}
