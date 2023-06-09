-- CreateTable
CREATE TABLE "PredictionHistory" (
    "id" SERIAL NOT NULL,
    "scammer_percentage" DOUBLE PRECISION,
    "scammer_count" INTEGER,
    "file" TEXT NOT NULL,

    CONSTRAINT "PredictionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PredictionHistory_file_key" ON "PredictionHistory"("file");
