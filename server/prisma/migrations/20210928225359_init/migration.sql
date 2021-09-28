/*
  Warnings:

  - A unique constraint covering the columns `[projectId,memberId]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "members_projectId_memberId_key" ON "members"("projectId", "memberId");
