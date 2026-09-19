ALTER TABLE "conversations"
ADD COLUMN "selectedDocumentIds" JSONB NOT NULL DEFAULT '[]';
