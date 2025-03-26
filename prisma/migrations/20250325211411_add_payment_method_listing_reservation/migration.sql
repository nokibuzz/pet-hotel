-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "paymentMethodsAccount" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'Cash';
