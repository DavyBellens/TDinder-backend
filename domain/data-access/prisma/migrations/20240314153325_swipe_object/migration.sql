/*
  Warnings:

  - You are about to drop the column `swipedRightEmails` on the `Profile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('L', 'R');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "swipedRightEmails";

-- CreateTable
CREATE TABLE "Swipe" (
    "id" SERIAL NOT NULL,
    "swiperId" INTEGER NOT NULL,
    "swipeeId" INTEGER NOT NULL,
    "direction" "Direction" NOT NULL,

    CONSTRAINT "Swipe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Swipe" ADD CONSTRAINT "Swipe_swiperId_fkey" FOREIGN KEY ("swiperId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Swipe" ADD CONSTRAINT "Swipe_swipeeId_fkey" FOREIGN KEY ("swipeeId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
