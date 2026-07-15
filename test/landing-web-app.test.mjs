import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

async function collectAssets (directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const assets = await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name)

    if (entry.isDirectory()) return collectAssets(path)
    if (/\.(?:html|js)$/.test(entry.name)) return readFile(path, 'utf8')
    return []
  }))

  return assets.flat()
}

test('landing page links to the Logseq web app', async () => {
  const assets = await collectAssets(fileURLToPath(new URL('../dist/', import.meta.url)))
  const output = assets.join('\n')

  assert.match(output, /https:\/\/app\.logseq\.com/)
  assert.match(output, /Web app/)
  assert.doesNotMatch(output, /https:\/\/demo\.logseq\.com/)
  assert.doesNotMatch(output, /Live Demo/)
})

test('landing page omits the Whiteboards feature', async () => {
  const assets = await collectAssets(fileURLToPath(new URL('../dist/', import.meta.url)))
  const output = assets.join('\n')

  assert.doesNotMatch(output, /Whiteboards/)
  assert.match(output, /Logseq Sync/)
  assert.match(output, /Real-time collaboration/)
  assert.doesNotMatch(output, /COMING SOON/)
})

test('landing page links to the public roadmap', async () => {
  const assets = await collectAssets(fileURLToPath(new URL('../dist/', import.meta.url)))
  const output = assets.join('\n')

  assert.match(output, /Roadmap/)
  assert.match(output, /https:\/\/logseq\.io\/p\/NX4mc_ggEV/)
})
