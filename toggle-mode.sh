#!/bin/bash

# Script to toggle between Coming Soon and Full App modes
# Usage: ./toggle-mode.sh [coming-soon|full-app]

MODE=${1:-"coming-soon"}

if [ "$MODE" = "coming-soon" ]; then
    echo "🚧 Switching to Coming Soon mode..."
    
    # Backup current full app files
    cp src/app/page.tsx backup/page-full-app.tsx 2>/dev/null || true
    cp src/app/layout.tsx backup/layout-full-app.tsx 2>/dev/null || true
    
    # Switch to coming soon files
    cp backup/page-coming-soon.tsx src/app/page.tsx
    cp backup/layout-coming-soon.tsx src/app/layout.tsx 2>/dev/null || {
        # Create coming soon layout if it doesn't exist
        cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "l.outsider - Bientôt Disponible",
  description: "Plateforme de beats de qualité professionnelle - Bientôt en ligne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <SessionProvider>
              <CartProvider>
                <main className="min-h-screen">
                  {children}
                </main>
              </CartProvider>
            </SessionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
EOF
    }
    
    echo "✅ Coming Soon page is now active"
    echo "📝 Full app files backed up to backup/"
    
elif [ "$MODE" = "full-app" ]; then
    echo "🚀 Switching to Full App mode..."
    
    # Backup current coming soon files
    cp src/app/page.tsx backup/page-coming-soon.tsx 2>/dev/null || true
    cp src/app/layout.tsx backup/layout-coming-soon.tsx 2>/dev/null || true
    
    # Restore full app files
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
