/*
  Warnings:

  - You are about to drop the `NFT` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ACTIVE_STATUS" AS ENUM ('ACTIVE', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_assetId_fkey";

-- AlterTable
ALTER TABLE "UserAssetBalance" ADD COLUMN     "status" "ACTIVE_STATUS" NOT NULL DEFAULT 'ACTIVE';

-- DropTable
DROP TABLE "NFT";

-- CreateTable
CREATE TABLE "Nft" (
    "assetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "baseURL" TEXT NOT NULL,

    CONSTRAINT "Nft_pkey" PRIMARY KEY ("assetId")
);

-- AddForeignKey
ALTER TABLE "Nft" ADD CONSTRAINT "Nft_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
