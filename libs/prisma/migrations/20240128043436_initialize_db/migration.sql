-- CreateEnum
CREATE TYPE "ASSET_TYPE" AS ENUM ('TOKEN', 'NFT');

-- CreateEnum
CREATE TYPE "DIRECTION" AS ENUM ('SEND', 'RECEIVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "address" VARCHAR(42) NOT NULL,
    "lastUpdatedBlockNumber" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAssetBalance" (
    "userId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "balance" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAssetBalance_pkey" PRIMARY KEY ("userId","assetId")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "address" VARCHAR(42) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "ASSET_TYPE" NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "assetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimal" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("assetId")
);

-- CreateTable
CREATE TABLE "NFT" (
    "assetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "baseURL" TEXT NOT NULL,

    CONSTRAINT "NFT_pkey" PRIMARY KEY ("assetId")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "transactionHash" VARCHAR(66) NOT NULL,
    "userId" TEXT NOT NULL,
    "targetAddress" VARCHAR(42) NOT NULL,
    "direction" "DIRECTION" NOT NULL,
    "address" VARCHAR(42) NOT NULL,
    "amount" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_address_key" ON "Asset"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_transactionHash_key" ON "Transaction"("transactionHash");

-- AddForeignKey
ALTER TABLE "UserAssetBalance" ADD CONSTRAINT "UserAssetBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAssetBalance" ADD CONSTRAINT "UserAssetBalance_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_address_fkey" FOREIGN KEY ("address") REFERENCES "Asset"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
