/*
  Warnings:

  - A unique constraint covering the columns `[eventToId]` on the table `Ride` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventFromId]` on the table `Ride` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "eventFromId" INTEGER,
ADD COLUMN     "eventToId" INTEGER;

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "toRideId" INTEGER,
    "fromRideId" INTEGER,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_toRideId_key" ON "Event"("toRideId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_fromRideId_key" ON "Event"("fromRideId");

-- CreateIndex
CREATE UNIQUE INDEX "Ride_eventToId_key" ON "Ride"("eventToId");

-- CreateIndex
CREATE UNIQUE INDEX "Ride_eventFromId_key" ON "Ride"("eventFromId");

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_eventToId_fkey" FOREIGN KEY ("eventToId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_eventFromId_fkey" FOREIGN KEY ("eventFromId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
