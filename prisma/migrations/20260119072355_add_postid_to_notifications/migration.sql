-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "postId" TEXT;

-- CreateIndex
CREATE INDEX "Notification_postId_idx" ON "Notification"("postId");
