ALTER TYPE "MissionStatus" ADD VALUE 'CREATED';

ALTER TABLE "missions"
ADD COLUMN "min_asset_token" TEXT,
ADD COLUMN "min_asset_amount" DECIMAL(39, 0) NOT NULL DEFAULT 0,
ADD COLUMN "expires_at" TEXT;

ALTER TABLE "submissions"
ADD COLUMN "stake_token" TEXT,
ADD COLUMN "stake_amount" DECIMAL(39, 0);
