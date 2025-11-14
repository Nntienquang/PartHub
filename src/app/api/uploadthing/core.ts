import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing({
  token: process.env.UPLOADTHING_SECRET || process.env.UPLOADTHING_TOKEN,
});

export const ourFileRouter = {
  avatarUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Avatar upload complete");
      console.log("File URL:", file.url);
      return { url: file.url };
    }),

  logoUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Logo upload complete");
      console.log("File URL:", file.url);
      return { url: file.url };
    }),

  cvUploader: f({ pdf: { maxFileSize: "10MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      console.log("CV upload complete");
      console.log("File URL:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

