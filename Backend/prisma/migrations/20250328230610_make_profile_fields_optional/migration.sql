-- AlterTable
ALTER TABLE "User" ALTER COLUMN "batch" DROP NOT NULL,
ALTER COLUMN "department" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "skills" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "university" DROP NOT NULL;
