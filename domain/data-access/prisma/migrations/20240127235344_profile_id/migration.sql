/*
  Warnings:

  - You are about to drop the column `profile1` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `profile2` on the `Match` table. All the data in the column will be lost.
  - Added the required column `profileId1` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId2` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "profile1",
DROP COLUMN "profile2",
ADD COLUMN     "profileId1" INTEGER NOT NULL,
ADD COLUMN     "profileId2" INTEGER NOT NULL;
