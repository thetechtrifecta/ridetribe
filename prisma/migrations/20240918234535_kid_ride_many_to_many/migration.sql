/*
  Warnings:

  - You are about to drop the `_RidesIn` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RidesIn" DROP CONSTRAINT "_RidesIn_A_fkey";

-- DropForeignKey
ALTER TABLE "_RidesIn" DROP CONSTRAINT "_RidesIn_B_fkey";

-- DropTable
DROP TABLE "_RidesIn";

-- CreateTable
CREATE TABLE "_KidToRide" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_KidToRide_AB_unique" ON "_KidToRide"("A", "B");

-- CreateIndex
CREATE INDEX "_KidToRide_B_index" ON "_KidToRide"("B");

-- AddForeignKey
ALTER TABLE "_KidToRide" ADD CONSTRAINT "_KidToRide_A_fkey" FOREIGN KEY ("A") REFERENCES "Kid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KidToRide" ADD CONSTRAINT "_KidToRide_B_fkey" FOREIGN KEY ("B") REFERENCES "Ride"("id") ON DELETE CASCADE ON UPDATE CASCADE;
