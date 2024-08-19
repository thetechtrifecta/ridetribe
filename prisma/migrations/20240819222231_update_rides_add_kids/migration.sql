/*
  Warnings:

  - Added the required column `dropoffAddress` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dropoffTime` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupAddress` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupTime` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seatsNeeded` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seatsOffered` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wantRide` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wouldDrive` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "description" TEXT,
ADD COLUMN     "dropoffAddress" TEXT NOT NULL,
ADD COLUMN     "dropoffTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pickupAddress" TEXT NOT NULL,
ADD COLUMN     "pickupTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "seatsNeeded" INTEGER NOT NULL,
ADD COLUMN     "seatsOffered" INTEGER NOT NULL,
ADD COLUMN     "wantRide" BOOLEAN NOT NULL,
ADD COLUMN     "wouldDrive" BOOLEAN NOT NULL,
ALTER COLUMN "title" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Kid" (
    "id" SERIAL NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "rideId" INTEGER NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "age" INTEGER,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Kid_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Kid" ADD CONSTRAINT "Kid_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kid" ADD CONSTRAINT "Kid_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
