-- Allow new documents to be finalized with a Supabase Storage key.
ALTER TABLE "documents" ALTER COLUMN "filePath" DROP NOT NULL;
ALTER TABLE "documents" ADD COLUMN "storagePath" TEXT;