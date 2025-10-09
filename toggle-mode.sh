#!/bin/bash

# Script to toggle between Coming Soon and Full App modes
# Usage: ./toggle-mode.sh [coming-soon|full-app]

MODE=${1:-"coming-soon"}

if [ "$MODE" = "coming-soon" ]; then
    echo "🚧 Switching to Coming Soon mode..."
    cp src/app/page.tsx backup/page-full-app.tsx 2>/dev/null || true
    cp src/app/layout.tsx backup/layout-full-app.tsx 2>/dev/null || true
    
    # Use the coming soon versions (already in place)
    echo "✅ Coming Soon page is now active"
    echo "📝 Original files backed up to backup/"
    
elif [ "$MODE" = "full-app" ]; then
    echo "🚀 Switching to Full App mode..."
    
    if [ -f "backup/page-original.tsx" ]; then
        cp backup/page-original.tsx src/app/page.tsx
        echo "✅ Restored original page.tsx"
    else
        echo "❌ Original page.tsx not found in backup/"
        exit 1
    fi
    
    if [ -f "backup/layout-original.tsx" ]; then
        cp backup/layout-original.tsx src/app/layout.tsx
        echo "✅ Restored original layout.tsx"
    else
        echo "❌ Original layout.tsx not found in backup/"
        exit 1
    fi
    
    echo "🎉 Full App is now active"
    
else
    echo "❌ Invalid mode. Use 'coming-soon' or 'full-app'"
    echo "Usage: ./toggle-mode.sh [coming-soon|full-app]"
    exit 1
fi

echo ""
echo "Next steps:"
echo "1. Commit your changes: git add . && git commit -m 'Toggle to $MODE mode'"
echo "2. Deploy to Vercel: git push"
