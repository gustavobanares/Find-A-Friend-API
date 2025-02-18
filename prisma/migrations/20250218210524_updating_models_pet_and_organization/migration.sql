/*
  Warnings:

  - You are about to drop the `photos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requirements` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "photos" DROP CONSTRAINT "photos_petId_fkey";

-- DropForeignKey
ALTER TABLE "requirements" DROP CONSTRAINT "requirements_petId_fkey";

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "photos" TEXT[],
ADD COLUMN     "requirements" TEXT[];

-- DropTable
DROP TABLE "photos";

-- DropTable
DROP TABLE "requirements";
