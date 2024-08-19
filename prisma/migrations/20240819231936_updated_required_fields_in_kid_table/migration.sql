/*
  Warnings:

  - Made the column `firstName` on table `Kid` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `Kid` required. This step will fail if there are existing NULL values in that column.
  - Made the column `age` on table `Kid` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Kid" ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "age" SET NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;
