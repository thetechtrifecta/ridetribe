/*
  Warnings:

  - You are about to drop the column `fromRideId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `toRideId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `dropoffTime` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `eventFromId` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `eventTitle` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `eventToId` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `pickupTime` on the `Ride` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId]` on the table `Ride` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId,rideType]` on the table `Ride` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ride" DROP CONSTRAINT "Ride_eventFromId_fkey";

-- DropForeignKey
ALTER TABLE "Ride" DROP CONSTRAINT "Ride_eventToId_fkey";

-- DropIndex
DROP INDEX "Event_fromRideId_key";

-- DropIndex
DROP INDEX "Event_toRideId_key";

-- DropIndex
DROP INDEX "Ride_eventFromId_key";

-- DropIndex
DROP INDEX "Ride_eventToId_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "fromRideId",
DROP COLUMN "toRideId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "dropoffTime",
DROP COLUMN "eventFromId",
DROP COLUMN "eventTitle",
DROP COLUMN "eventToId",
DROP COLUMN "pickupTime",
ADD COLUMN     "eventId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Ride_eventId_key" ON "Ride"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Ride_eventId_rideType_key" ON "Ride"("eventId", "rideType");

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
