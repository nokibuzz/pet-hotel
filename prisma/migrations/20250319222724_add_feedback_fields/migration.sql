-- AlterTable
ALTER TABLE "User" ADD COLUMN     "negativeFeedback" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "positiveFeedback" INTEGER NOT NULL DEFAULT 0;
