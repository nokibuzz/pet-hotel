/*
  Warnings:

  - You are about to drop the column `age` on the `Pet` table. All the data in the column will be lost.
  - Added the required column `birth` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeName` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `friendly` on the `Pet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "age",
ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "birth" TEXT NOT NULL,
ADD COLUMN     "typeName" TEXT NOT NULL,
DROP COLUMN "friendly",
ADD COLUMN     "friendly" INTEGER NOT NULL;
