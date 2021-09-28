/*
  Warnings:

  - The primary key for the `members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `members` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,memberId]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "members" DROP CONSTRAINT "members_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "members_projectId_memberId_key" ON "members"("projectId", "memberId");
