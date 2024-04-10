/*
  Warnings:

  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - Added the required column `meetingPreferance` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `availability` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "location",
ADD COLUMN     "meetingPreferance" TEXT NOT NULL,
ALTER COLUMN "availability" SET NOT NULL;
