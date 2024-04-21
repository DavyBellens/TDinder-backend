-- DropIndex
DROP INDEX "Profile_username_key";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "swipedRightEmails" TEXT[];
