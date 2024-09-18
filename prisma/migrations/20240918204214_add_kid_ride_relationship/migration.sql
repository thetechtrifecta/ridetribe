/*
  Warnings:

  - You are about to drop the column `rideId` on the `Kid` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Kid" DROP CONSTRAINT "Kid_rideId_fkey";

-- AlterTable
ALTER TABLE "Kid" DROP COLUMN "rideId";

-- CreateTable
CREATE TABLE "_RidesIn" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RidesIn_AB_unique" ON "_RidesIn"("A", "B");

-- CreateIndex
CREATE INDEX "_RidesIn_B_index" ON "_RidesIn"("B");

-- AddForeignKey
ALTER TABLE "_RidesIn" ADD CONSTRAINT "_RidesIn_A_fkey" FOREIGN KEY ("A") REFERENCES "Kid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RidesIn" ADD CONSTRAINT "_RidesIn_B_fkey" FOREIGN KEY ("B") REFERENCES "Ride"("id") ON DELETE CASCADE ON UPDATE CASCADE;
