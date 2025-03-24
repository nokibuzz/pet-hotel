/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "blockedBreeds" TEXT[];

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "ownerId",
ADD COLUMN     "breed" TEXT,
ADD COLUMN     "breedDescription" TEXT;
