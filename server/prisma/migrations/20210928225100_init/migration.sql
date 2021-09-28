-- DropIndex
DROP INDEX "members_projectId_memberId_key";

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "members_pkey" PRIMARY KEY ("id");
