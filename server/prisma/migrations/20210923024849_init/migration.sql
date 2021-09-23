-- DropForeignKey
ALTER TABLE "bugs" DROP CONSTRAINT "bugs_closedById_fkey";

-- DropForeignKey
ALTER TABLE "bugs" DROP CONSTRAINT "bugs_reopenedById_fkey";

-- DropForeignKey
ALTER TABLE "bugs" DROP CONSTRAINT "bugs_updatedById_fkey";

-- AlterTable
ALTER TABLE "bugs" ALTER COLUMN "closedById" DROP NOT NULL,
ALTER COLUMN "closedAt" DROP NOT NULL,
ALTER COLUMN "reopenedById" DROP NOT NULL,
ALTER COLUMN "reopenedAt" DROP NOT NULL,
ALTER COLUMN "updatedById" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "bugs" ADD CONSTRAINT "bugs_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bugs" ADD CONSTRAINT "bugs_reopenedById_fkey" FOREIGN KEY ("reopenedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bugs" ADD CONSTRAINT "bugs_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
