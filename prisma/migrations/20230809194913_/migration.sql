/*
  Warnings:

  - You are about to alter the column `paid_amount` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "paid_amount" SET DEFAULT '',
ALTER COLUMN "paid_amount" SET DATA TYPE VARCHAR(10);
