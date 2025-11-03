#!/usr/bin/env node
/* CommonJS variant: ensures lightningcss native binary exists. */
const { execSync } = require('node:child_process')
const { existsSync, readdirSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')

function log(msg) { console.log(`[ensure-lightningcss] ${msg}`) }

function findLightningDir() {
  const dir = join(process.cwd(), 'node_modules', 'lightningcss')
  return existsSync(dir) ? dir : null
}
function hasNativeBinary(dir) {
  try { return readdirSync(dir).some(f => /lightningcss.*\.node$/.test(f)) } catch { return false }
}
function listDir(dir) {
  try { console.log('[ensure-lightningcss] contents:', readdirSync(dir)) } catch(e){ console.log('[ensure-lightningcss] list error', e.message) }
}
function main() {
  const dir = findLightningDir()
  if (!dir) {
    log('package directory missing, will rebuild')
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
  const after = findLightningDir()
  if (!after || !hasNativeBinary(after)) {
    log('still missing after rebuild; enabling fallback')
    try { writeFileSync('.lightningcss-missing', 'true') } catch {}
    process.exit(0)
  }
  log('native binary ready')
}
main()

