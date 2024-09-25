-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "pickupTime" TIMESTAMP(3),
ADD COLUMN     "rideType" TEXT NOT NULL DEFAULT 'to',
ALTER COLUMN "dropoffTime" DROP NOT NULL;
