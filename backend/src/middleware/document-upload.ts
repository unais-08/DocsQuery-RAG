import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import { DocumentError } from "../modules/documents/document.errors.js";
import { documentUpload } from "../modules/documents/file-storage.js";

export const handleDocumentUpload = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  documentUpload(request, response, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        next(
          new DocumentError(
            "Uploaded file is too large",
            413,
            "FILE_TOO_LARGE"
          )
        );
        return;
      }

      if (error.code === "LIMIT_UNEXPECTED_FILE") {
        next(
          new DocumentError(
            "Only one file can be uploaded in the file field",
            400,
            "INVALID_UPLOAD"
          )
        );
        return;
      }
    }

    next(error);
  });
};