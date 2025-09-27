# 🔄 Migration Guide - Licensing System

## Overview

This guide covers the migration from the old single-price system to the new three-tier licensing system with dynamic pricing and Stripe integration.

## 🚀 Migration Steps

### 1. Database Schema Updates

#### Add New Price Columns
```sql
-- Add new pricing columns
ALTER TABLE "Beat" ADD COLUMN "wavLeasePrice" DECIMAL(10,2) DEFAULT 19.99;
ALTER TABLE "Beat" ADD COLUMN "trackoutLeasePrice" DECIMAL(10,2) DEFAULT 39.99;
ALTER TABLE "Beat" ADD COLUMN "unlimitedLeasePrice" DECIMAL(10,2) DEFAULT 79.99;

-- Add Stripe price ID columns
ALTER TABLE "Beat" ADD COLUMN "stripeWavPriceId" VARCHAR(255);
ALTER TABLE "Beat" ADD COLUMN "stripeTrackoutPriceId" VARCHAR(255);
ALTER TABLE "Beat" ADD COLUMN "stripeUnlimitedPriceId" VARCHAR(255);
```

#### Update LicenseType Enum
```sql
-- Add new license types
ALTER TYPE "LicenseType" ADD VALUE 'WAV_LEASE';
ALTER TYPE "LicenseType" ADD VALUE 'TRACKOUT_LEASE';
ALTER TYPE "LicenseType" ADD VALUE 'UNLIMITED_LEASE';

-- Update existing records
UPDATE "Order" SET "licenseType" = 'WAV_LEASE' WHERE "licenseType" = 'NON_EXCLUSIVE';
UPDATE "MultiItemOrder" SET "licenseType" = 'WAV_LEASE' WHERE "licenseType" = 'NON_EXCLUSIVE';
```

### 2. Run Migration Scripts

#### Add Missing Columns
```bash
# Run the script to add missing columns
npx ts-node scripts/add-missing-columns.ts
```

#### Add Stripe Columns
```bash
# Run the script to add Stripe price ID columns
npx ts-node scripts/add-stripe-columns.ts
```

#### Migrate Stripe Prices
```bash
# Create Stripe products for existing beats
npx ts-node scripts/migrate-stripe-prices.ts
```

### 3. Update Application Code

#### Update Beat Types
```typescript
// Update Beat interface
interface Beat {
  // ... existing fields
  wavLeasePrice: number
  trackoutLeasePrice: number
  unlimitedLeasePrice: number
  stripeWavPriceId?: string | null
  stripeTrackoutPriceId?: string | null
  stripeUnlimitedPriceId?: string | null
}
```

#### Update Cart Context
```typescript
// Update CartItem interface
interface CartItem {
  beat: Beat
  licenseType: LicenseType
  quantity: number
  addedAt: Date
}
```

#### Update API Routes
```typescript
// Update checkout API
const items = cartItems.map(item => ({
  priceId: getPriceIdByLicense(item.beat, item.licenseType),
  quantity: item.quantity,
  beatTitle: item.beat.title,
  licenseType: item.licenseType
}))
```

## 🔧 Migration Scripts

### 1. add-missing-columns.ts
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMissingColumns() {
  try {
    console.log('🔧 Adding missing price columns to database...')
    
    // Add price columns
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "wavLeasePrice" DECIMAL(10,2) DEFAULT 19.99
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "trackoutLeasePrice" DECIMAL(10,2) DEFAULT 39.99
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "unlimitedLeasePrice" DECIMAL(10,2) DEFAULT 79.99
    `
    
    console.log('✅ Price columns added successfully!')
  } catch (error) {
    console.error('❌ Error adding columns:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addMissingColumns()
```

### 2. add-stripe-columns.ts
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addStripeColumns() {
  try {
    console.log('🔧 Adding Stripe price ID columns to database...')
    
    // Add Stripe columns
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "stripeWavPriceId" VARCHAR(255) DEFAULT NULL
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "stripeTrackoutPriceId" VARCHAR(255) DEFAULT NULL
    `
    
    await prisma.$executeRaw`
      ALTER TABLE "Beat" 
      ADD COLUMN IF NOT EXISTS "stripeUnlimitedPriceId" VARCHAR(255) DEFAULT NULL
    `
    
    console.log('✅ Stripe columns added successfully!')
  } catch (error) {
    console.error('❌ Error adding Stripe columns:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addStripeColumns()
```

### 3. migrate-stripe-prices.ts
```typescript
import { PrismaClient } from '@prisma/client'
import { createBeatStripeProducts } from '../src/lib/stripe'

const prisma = new PrismaClient()

async function migrateStripePrices() {
  try {
    console.log('🚀 Starting Stripe prices migration...')
    
    // Get beats without Stripe prices
    const beats = await prisma.beat.findMany({
      where: {
        stripeWavPriceId: null
      }
    })
    
    console.log(`📊 Found ${beats.length} beats to migrate`)
    
    for (const beat of beats) {
      try {
        console.log(`🎵 Processing beat: ${beat.title}`)
        
        // Create Stripe products
        const stripeProducts = await createBeatStripeProducts({
          id: beat.id,
          title: beat.title,
          description: beat.description,
          wavLeasePrice: Number(beat.wavLeasePrice),
          trackoutLeasePrice: Number(beat.trackoutLeasePrice),
          unlimitedLeasePrice: Number(beat.unlimitedLeasePrice)
        })
        
        // Update beat with Stripe price IDs
        await prisma.beat.update({
          where: { id: beat.id },
          data: {
            stripeWavPriceId: stripeProducts.prices.wav,
            stripeTrackoutPriceId: stripeProducts.prices.trackout,
            stripeUnlimitedPriceId: stripeProducts.prices.unlimited
          }
        })
        
        console.log(`✅ Updated beat: ${beat.title}`)
        
        // Pause to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`❌ Error migrating beat ${beat.title}:`, error)
      }
    }
    
    console.log('🎉 Stripe prices migration completed!')
    
  } catch (error) {
    console.error('❌ Global error during migration:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateStripePrices()
```

## 🧪 Testing Migration

### 1. Pre-Migration Tests
```bash
# Test database connection
npx prisma db pull

# Check existing data
npx prisma studio
```

### 2. Post-Migration Tests
```bash
# Test new columns exist
npx prisma db pull

# Test Stripe integration
npm run stripe:create-product

# Test application
npm run dev
```

### 3. Verification Checklist
- [ ] All beats have three price columns
- [ ] All beats have Stripe price IDs
- [ ] License types are correctly set
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Download restrictions work
- [ ] Stems access is properly restricted

## 🚨 Rollback Plan

### 1. Database Rollback
```sql
-- Remove new columns (if needed)
ALTER TABLE "Beat" DROP COLUMN "wavLeasePrice";
ALTER TABLE "Beat" DROP COLUMN "trackoutLeasePrice";
ALTER TABLE "Beat" DROP COLUMN "unlimitedLeasePrice";
ALTER TABLE "Beat" DROP COLUMN "stripeWavPriceId";
ALTER TABLE "Beat" DROP COLUMN "stripeTrackoutPriceId";
ALTER TABLE "Beat" DROP COLUMN "stripeUnlimitedPriceId";

-- Revert license types
UPDATE "Order" SET "licenseType" = 'NON_EXCLUSIVE' WHERE "licenseType" = 'WAV_LEASE';
UPDATE "MultiItemOrder" SET "licenseType" = 'NON_EXCLUSIVE' WHERE "licenseType" = 'WAV_LEASE';
```

### 2. Code Rollback
```bash
# Revert to previous commit
git revert <commit-hash>

# Or reset to previous state
git reset --hard <previous-commit>
```

## 📊 Migration Monitoring

### 1. Database Metrics
- Monitor column addition progress
- Check data integrity
- Verify foreign key constraints

### 2. Stripe Metrics
- Monitor API rate limits
- Check product creation success rate
- Verify price ID generation

### 3. Application Metrics
- Test cart functionality
- Verify checkout process
- Check download access

## 🔍 Troubleshooting

### Common Issues

#### 1. Column Already Exists
```sql
-- Check if columns exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'Beat' 
AND column_name IN ('wavLeasePrice', 'trackoutLeasePrice', 'unlimitedLeasePrice');
```

#### 2. Stripe API Errors
```typescript
// Check Stripe configuration
console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Missing')
console.log('Stripe Publishable Key:', process.env.STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Missing')
```

#### 3. License Type Errors
```sql
-- Check license type values
SELECT DISTINCT "licenseType" FROM "Order";
SELECT DISTINCT "licenseType" FROM "MultiItemOrder";
```

### Solutions

#### 1. Fix Missing Columns
```bash
# Run column addition script
npx ts-node scripts/add-missing-columns.ts
```

#### 2. Fix Stripe Integration
```bash
# Check environment variables
echo $STRIPE_SECRET_KEY
echo $STRIPE_PUBLISHABLE_KEY

# Test Stripe connection
npx ts-node scripts/test-stripe-connection.ts
```

#### 3. Fix License Types
```sql
-- Update license types
UPDATE "Order" SET "licenseType" = 'WAV_LEASE' WHERE "licenseType" = 'NON_EXCLUSIVE';
UPDATE "MultiItemOrder" SET "licenseType" = 'WAV_LEASE' WHERE "licenseType" = 'NON_EXCLUSIVE';
```

## 📈 Post-Migration Tasks

### 1. Data Cleanup
- Remove old price column (if desired)
- Clean up unused Stripe products
- Archive old migration scripts

### 2. Performance Optimization
- Add indexes on new columns
- Optimize queries with new fields
- Monitor database performance

### 3. Documentation Updates
- Update API documentation
- Update user guides
- Update deployment guides

## 🎯 Success Criteria

### 1. Functional Requirements
- [ ] All beats have three license prices
- [ ] Cart supports license selection
- [ ] Checkout works with new pricing
- [ ] Downloads respect license restrictions
- [ ] Stems access is properly controlled

### 2. Performance Requirements
- [ ] Page load times maintained
- [ ] Database queries optimized
- [ ] Stripe integration stable
- [ ] No memory leaks

### 3. Security Requirements
- [ ] License verification working
- [ ] Download access controlled
- [ ] No unauthorized access
- [ ] Data integrity maintained

---

**Migration Version**: 1.0.0
**Last Updated**: January 2025
**Maintainer**: Development Team
