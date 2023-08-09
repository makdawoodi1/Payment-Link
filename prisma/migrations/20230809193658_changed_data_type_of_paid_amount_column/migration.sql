/*
  Warnings:

  - The `paid_amount` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "paid_amount",
ADD COLUMN     "paid_amount" INTEGER;
