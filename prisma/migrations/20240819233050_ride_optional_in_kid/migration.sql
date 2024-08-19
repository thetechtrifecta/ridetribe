-- DropForeignKey
ALTER TABLE "Kid" DROP CONSTRAINT "Kid_rideId_fkey";

-- AlterTable
ALTER TABLE "Kid" ALTER COLUMN "rideId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Kid" ADD CONSTRAINT "Kid_rideId_fkey" FOREIGN KEY ("rideId") REFERENCES "Ride"("id") ON DELETE SET NULL ON UPDATE CASCADE;
