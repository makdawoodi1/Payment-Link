/*
  Warnings:

  - A unique constraint covering the columns `[stripe_customer_id]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "stripe_customer_id" VARCHAR(300) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "orders_stripe_customer_id_key" ON "orders"("stripe_customer_id");
