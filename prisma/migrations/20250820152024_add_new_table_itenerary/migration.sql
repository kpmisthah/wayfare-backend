-- CreateTable
CREATE TABLE "Itenerary" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "activities" TEXT NOT NULL,
    "meals" TEXT NOT NULL,
    "accommodation" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,

    CONSTRAINT "Itenerary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Itenerary" ADD CONSTRAINT "Itenerary_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
