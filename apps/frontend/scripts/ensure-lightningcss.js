#!/usr/bin/env node
/*
  Ensures lightningcss native binary exists. Rebuilds from source if missing.
*/
const { execSync } = require('node:child_process')
const { existsSync, readdirSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')

function log(msg) { console.log(`[ensure-lightningcss] ${msg}`) }

function findLightningDir() {
  const dir = join(process.cwd(), 'node_modules', 'lightningcss')
  return existsSync(dir) ? dir : null
}

function hasNativeBinary(dir) {
  try {
    const files = readdirSync(dir)
    return files.some(f => /lightningcss.*\.node$/.test(f))
  } catch { return false }
}

function listDir(dir){
  try{ console.log('[ensure-lightningcss] contents:', readdirSync(dir)) }catch(e){ console.log('[ensure-lightningcss] list error', e.message) }
}

function main() {
  const dir = findLightningDir()
  if (!dir) {
    log('lightningcss directory not found – will rebuild')
  } else if (hasNativeBinary(dir)) {
    log('native binary present, skipping rebuild')
    listDir(dir)
    return
  } else {
    listDir(dir)
  }
  log('native binary missing – rebuilding from source')
  try {
    execSync('npm rebuild lightningcss --build-from-source', { stdio: 'inherit' })
  } catch (e) {
    log('rebuild failed: ' + e.message)
    process.exit(1)
  }
  const dir2 = findLightningDir()
  if (!dir2 || !hasNativeBinary(dir2)) {
    log('native binary still missing after rebuild, creating fallback marker')
    try { writeFileSync('.lightningcss-missing', 'true') } catch {}
    process.exit(0) // allow build to continue with fallback
  }
  log('native binary ready')
}

main()
