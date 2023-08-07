-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "project_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "link_token" VARCHAR(300) NOT NULL,
    "packages" VARCHAR(300) NOT NULL,
    "description" TEXT NOT NULL,
    "item_price" INTEGER NOT NULL,
    "sales_email" VARCHAR(150) NOT NULL,
    "item_price_currency" VARCHAR(11) NOT NULL,
    "fname" VARCHAR(150) NOT NULL,
    "lname" VARCHAR(150) NOT NULL,
    "address" VARCHAR(300) NOT NULL,
    "address2" VARCHAR(300) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "state" VARCHAR(50) NOT NULL,
    "zip" VARCHAR(10) NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "paid_amount" VARCHAR(10) NOT NULL,
    "paid_amount_currency" VARCHAR(10) NOT NULL,
    "txn_id" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "payment_status" VARCHAR(20) NOT NULL,
    "created" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);
