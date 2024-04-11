/*
  Warnings:

  - A unique constraint covering the columns `[transactionHash,targetAddress]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionHash_targetAddress_key" ON "Transaction"("transactionHash", "targetAddress");
