/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `WishlistItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "WishlistItem_userId_listingId_key";

-- AlterTable
ALTER TABLE "WishlistItem" ADD COLUMN     "postId" TEXT,
ALTER COLUMN "listingId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "WishlistItem_postId_idx" ON "WishlistItem"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistItem_userId_postId_key" ON "WishlistItem"("userId", "postId");

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
