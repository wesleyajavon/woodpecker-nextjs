#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking database content...');

  try {
    const categories = await prisma.fAQCategory.findMany({
      include: { faqs: true },
    });
    console.log('📁 FAQ Categories:', categories.map(c => `${c.slug} (${c.faqs.length} FAQs)`));

    const faqs = await prisma.fAQItem.findMany({
      include: { category: true },
    });
    console.log('💬 FAQ Items:', faqs.length);
    faqs.forEach(faq => {
      console.log(`  - ${faq.question.substring(0, 50)}... (${faq.category.slug})`);
    });

    const licenses = await prisma.licenseInfo.findMany();
    console.log('📄 License Infos:', licenses.map(l => `${l.slug}: ${l.displayName}`));

    const features = await prisma.licenseFeature.findMany();
    console.log('⚙️ License Features:', features.map(f => `${f.name}: ${f.category}`));

  } catch (error) {
    console.error('❌ Error checking database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('💥 Database check failed:', e);
    process.exit(1);
  });
