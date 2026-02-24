#!/usr/bin/env node
/**
 * WebP Conversion Script for B1touch Artistry Portfolio
 * Converts JPEG images to WebP format with fallback support
 * 
 * Usage: node scripts/convert-to-webp.js
 * 
 * Options:
 *   --quality    WebP quality (1-100, default: 80)
 *   --width      Max width (default: 1200)
 *   --force      Force reconvert all images
 */

import sharp from 'sharp';
import { glob } from 'glob';
import { dirname, join, basename, relative } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, existsSync, statSync, writeFileSync, readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const INPUT_DIR = join(ROOT_DIR, 'src/assets/images');
const OUTPUT_DIR = join(ROOT_DIR, 'src/assets/images-webp');
const MANIFEST_PATH = join(OUTPUT_DIR, 'manifest.json');

// Parse command line arguments
const args = process.argv.slice(2);
const QUALITY = parseInt(args.find(a => a.startsWith('--quality='))?.split('=')[1] || '80', 10);
const MAX_WIDTH = parseInt(args.find(a => a.startsWith('--width='))?.split('=')[1] || '1200', 10);
const FORCE = args.includes('--force');

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Manifest to track conversions
let manifest = {};
if (existsSync(MANIFEST_PATH)) {
  try {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch (e) {
    console.log('Creating new manifest...');
    manifest = {};
  }
}

async function convertImage(inputPath, outputPath, filename) {
  const inputStat = statSync(inputPath);
  const existingEntry = manifest[filename];
  
  // Skip if already converted and not forced
  if (!FORCE && existingEntry && existingEntry.converted) {
    const outputStat = existsSync(outputPath) ? statSync(outputPath) : null;
    if (outputStat && outputStat.mtime > inputStat.mtime) {
      console.log(`  ⏭️  Skipping ${filename} (already converted)`);
      return { skipped: true };
    }
  }

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Resize if wider than max width
    let processedImage = image;
    if (metadata.width > MAX_WIDTH) {
      processedImage = image.resize(MAX_WIDTH, null, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Convert to WebP
    await processedImage
      .webp({ 
        quality: QUALITY,
        effort: 4,  // Balance between speed and compression
        smartSubsample: true,
      })
      .toFile(outputPath);
    
    const outputStat = statSync(outputPath);
    const originalSize = inputStat.size;
    const webpSize = outputStat.size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);
    
    return {
      success: true,
      originalSize,
      webpSize,
      savings
    };
  } catch (error) {
    console.error(`  ❌ Error converting ${filename}:`, error.message);
    return { error: error.message };
  }
}

async function main() {
  console.log('🖼️  WebP Conversion Script');
  console.log('==========================');
  console.log(`Input:  ${INPUT_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Quality: ${QUALITY}%`);
  console.log(`Max Width: ${MAX_WIDTH}px`);
  console.log(`Force: ${FORCE}`);
  console.log('');
  
  // Find all JPEG images
  const files = await glob(`${INPUT_DIR}/*.jpg`);
  
  if (files.length === 0) {
    console.log('No JPEG images found in input directory.');
    return;
  }
  
  console.log(`Found ${files.length} images to process.\n`);
  
  let converted = 0;
  let skipped = 0;
  let failed = 0;
  let totalOriginalSize = 0;
  let totalWebPSize = 0;
  
  for (const file of files) {
    const filename = basename(file);
    const webpFilename = filename.replace('.jpg', '.webp');
    const outputPath = join(OUTPUT_DIR, webpFilename);
    
    console.log(`📷 Processing: ${filename}`);
    
    const result = await convertImage(file, outputPath, filename);
    
    if (result.skipped) {
      skipped++;
    } else if (result.success) {
      converted++;
      totalOriginalSize += result.originalSize;
      totalWebPSize += result.webpSize;
      
      manifest[filename] = {
        webp: webpFilename,
        converted: true,
        originalSize: result.originalSize,
        webpSize: result.webpSize,
        savings: result.savings + '%',
        timestamp: new Date().toISOString()
      };
      
      console.log(`  ✅ Converted! Size: ${(result.webpSize / 1024).toFixed(1)}KB (saved ${result.savings}%)`);
    } else {
      failed++;
      // Mark as failed in manifest but keep original as fallback
      manifest[filename] = {
        webp: null,  // null means use original
        converted: false,
        error: result.error,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  // Save manifest
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`\n📝 Manifest saved to: ${MANIFEST_PATH}`);
  
  // Summary
  console.log('\n📊 Conversion Summary');
  console.log('====================');
  console.log(`✅ Converted: ${converted}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (converted > 0) {
    const totalSavings = ((1 - totalWebPSize / totalOriginalSize) * 100).toFixed(1);
    console.log(`\n💾 Total Size Reduction:`);
    console.log(`   Original: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   WebP:     ${(totalWebPSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Saved:    ${totalSavings}%`);
  }
  
  if (failed > 0) {
    console.log('\n⚠️  Some images failed to convert. Original JPEGs will be used as fallback.');
  }
  
  console.log('\n✨ Done!');
}

main().catch(console.error);
