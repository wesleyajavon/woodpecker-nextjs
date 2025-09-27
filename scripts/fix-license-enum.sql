-- Script pour corriger l'enum LicenseType
-- Ce script gère la transition de NON_EXCLUSIVE vers les nouveaux types

-- 1. Mettre à jour les valeurs existantes de NON_EXCLUSIVE vers WAV_LEASE
UPDATE "Order" SET "licenseType" = 'WAV_LEASE' WHERE "licenseType" = 'NON_EXCLUSIVE';
UPDATE "MultiItemOrder" SET "licenseType" = 'WAV_LEASE' WHERE "licenseType" = 'NON_EXCLUSIVE';

-- 2. Créer le nouvel enum
CREATE TYPE "LicenseType_new" AS ENUM ('WAV_LEASE', 'TRACKOUT_LEASE', 'UNLIMITED_LEASE', 'EXCLUSIVE', 'CUSTOM');

-- 3. Modifier les colonnes pour utiliser le nouvel enum
ALTER TABLE "Order" ALTER COLUMN "licenseType" TYPE "LicenseType_new" USING "licenseType"::text::"LicenseType_new";
ALTER TABLE "MultiItemOrder" ALTER COLUMN "licenseType" TYPE "LicenseType_new" USING "licenseType"::text::"LicenseType_new";

-- 4. Supprimer l'ancien enum
DROP TYPE "LicenseType";

-- 5. Renommer le nouvel enum
ALTER TYPE "LicenseType_new" RENAME TO "LicenseType";

-- 6. Ajouter les nouveaux champs pour les priceId Stripe
ALTER TABLE "Beat" ADD COLUMN "stripeWavPriceId" TEXT;
ALTER TABLE "Beat" ADD COLUMN "stripeTrackoutPriceId" TEXT;
ALTER TABLE "Beat" ADD COLUMN "stripeUnlimitedPriceId" TEXT;
