/*
  Warnings:

  - You are about to drop the column `title` on the `Ride` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ride" RENAME COLUMN "title" TO "eventTitle";
