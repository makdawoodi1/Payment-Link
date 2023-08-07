/*
  Warnings:

  - A unique constraint covering the columns `[link_token]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "orders_link_token_key" ON "orders"("link_token");
