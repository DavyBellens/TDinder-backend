/*
  Warnings:

  - The values [QUEER] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `orientation` on the `Profile` table. All the data in the column will be lost.
  - Added the required column `preference` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Preference" AS ENUM ('MALE', 'FEMALE', 'BOTH', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "Gender_new" AS ENUM ('MAN', 'WOMAN', 'NON_BINARY', 'TRANS', 'OTHER');
ALTER TABLE "Profile" ALTER COLUMN "gender" TYPE "Gender_new" USING ("gender"::text::"Gender_new");
ALTER TYPE "Gender" RENAME TO "Gender_old";
ALTER TYPE "Gender_new" RENAME TO "Gender";
DROP TYPE "Gender_old";
COMMIT;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "orientation",
ADD COLUMN     "preference" "Preference" NOT NULL,
ADD COLUMN     "socials" TEXT[];

-- DropEnum
DROP TYPE "Orientation";
