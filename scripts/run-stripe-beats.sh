#!/bin/bash

# Load environment variables from .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
    echo "✅ Environment variables loaded from .env.local"
else
    echo "❌ .env.local file not found"
    exit 1
fi

# Run the Stripe beats script
echo "🚀 Running Stripe beats script..."
npx tsx scripts/create-stripe-beats.ts






