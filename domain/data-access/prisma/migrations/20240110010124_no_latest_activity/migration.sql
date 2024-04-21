/*
  Warnings:

  - You are about to drop the column `latestActivity` on the `Profile` table. All the data in the column will be lost.
  - Made the column `age` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "latestActivity",
ALTER COLUMN "age" SET NOT NULL;
