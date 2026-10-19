import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { hash, verifyImage, existingImageDigest, verifiedRuntimeImage, browserAcceptance } from './release-image.mjs'

const sha = 'a'.repeat(40)
const date = '2026-10-14T00:00:00Z'
function fixture(change = {}) {
  const config = Buffer.from(JSON.stringify({ os: 'linux', architecture: 'amd64', config: { Labels: {
    'org.opencontainers.image.revision': sha,
    'org.opencontainers.image.source': 'https://github.com/e-dialect/hinghwa-dict-web',
    'org.opencontainers.image.version': `sha-${sha}`,
    'org.opencontainers.image.created': date,
  } }, ...change }))
  const raw = Buffer.from(JSON.stringify({ mediaType: 'application/vnd.oci.image.manifest.v1+json', config: { digest: hash(config), size: config.length } }))
  return { config, raw, digest: hash(raw) }
}
test('manifest hashes actual raw config and accepts only correct identity', () => {
  const f = fixture()
  assert.equal(verifyImage(f.raw, f.config, f.digest, sha, date), hash(f.config))
  assert.throws(() => verifyImage(f.raw, Buffer.from('{}'), f.digest, sha, date))
  assert.throws(() => verifyImage(f.raw, f.config, 'sha256:' + '0'.repeat(64), sha, date))
  assert.throws(() => verifyImage(f.raw, f.config, f.digest, 'b'.repeat(40), date))
  const arm = fixture({ architecture: 'arm64' })
  assert.throws(() => verifyImage(arm.raw, arm.config, arm.digest, sha, date))
})
test('unknown registry access fails closed and only new-package 404 is absent', async () => {
  const old = globalThis.fetch
  process.env.GHCR_TOKEN = 'synthetic-only'
  try {
    globalThis.fetch = async () => ({ status: 403, ok: false })
    await assert.rejects(existingImageDigest('web', sha, date))
    globalThis.fetch = async () => ({ status: 404, ok: false })
    assert.equal(await existingImageDigest('web', sha, date), '')
  } finally { globalThis.fetch = old; delete process.env.GHCR_TOKEN }
})

const yaml = readFileSync(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8')
const authorization = yaml.split('          script: |\n')[1].split('\n  publish:')[0].split('\n').map(line => line.replace(/^            /, '')).join('\n')
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
// Execute the actual inline authorization, preserving the no-checkout trust boundary.
function fakeClock() {
  let now = 0, sequence = 0, scheduled = false
  const timers = new Map()
  function pump() {
    if (scheduled || !timers.size) return
    scheduled = true
    setImmediate(() => {
      scheduled = false
      const task = [...timers].sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0]
      if (!task) return
      timers.delete(task[0]); now = task[1].at; task[1].callback(); pump()
    })
  }
  return {
    Date: { now: () => now },
    setTimeout(callback, delay) { const id = ++sequence; timers.set(id, { callback, at: now + delay }); pump(); return id },
    clearTimeout(id) { timers.delete(id) },
    close() { timers.clear() },
  }
}
async function authorize(change = {}, master = sha, gate = 'success', codeOrOptions = authorization) {
  const options = typeof codeOrOptions === 'string' ? { code: codeOrOptions } : codeOrOptions
  const code = options.code ?? authorization
  const base = { id: 123, head_sha: sha, head_branch: 'master', head_repository: { full_name: 'e-dialect/hinghwa-dict-web', id: 393897080 }, repository: { full_name: 'e-dialect/hinghwa-dict-web', id: 393897080 }, workflow_id: 456, event: 'push', run_number: 7, status: 'completed', conclusion: 'success', ...change }
  const out = {}, clock = fakeClock(), stats = options.stats ?? {}
  Object.assign(stats, { runReads: 0, branchReads: 0, jobReads: 0, waits: 0, outputs: out, requests: [] })
  const at = (values, index, fallback) => values ? values[Math.min(index, values.length - 1)] : fallback
  let round = 0
  const track = args => { stats.requests.push(args); assert.ok(args.request.signal instanceof AbortSignal) }
  const github = { rest: { repos: { getBranch: async args => {
    track(args); return { data: { commit: { sha: at(options.masters, stats.branchReads++, master) } } }
  } }, actions: {
    getWorkflow: async args => { track(args); return { data: { id: 456 } } },
    getWorkflowRun: async args => {
      track(args); round = stats.runReads++
      if (options.blockRun) return new Promise(() => {})
      if (options.apiError) throw new Error('synthetic API failure')
      return { data: { ...base, ...at(options.runs, round, {}) } }
    },
    listWorkflowRuns: async args => {
      track(args); return { data: { workflow_runs: options.newerAt === round ? [base, { ...base, id: 124, run_number: 8 }] : at(options.candidates, round, [base]) } }
    }, listJobsForWorkflowRun: () => {},
  } }, paginate: async (_endpoint, args) => {
    track(args); stats.jobReads++
    return at(options.jobs, round, gate === 'missing' ? [] : Array.from({ length: gate === 'duplicate' ? 2 : 1 }, () => ({ name: 'CI gate', status: 'completed', conclusion: gate === 'duplicate' ? 'success' : gate })))
  } }
  try {
    await new AsyncFunction('github', 'context', 'core', 'Date', 'setTimeout', 'clearTimeout', code)(github,
      { repo: {}, payload: { workflow_run: { id: 123, head_sha: sha } } },
      { setOutput: (key, value) => { out[key] = value }, info: () => { stats.waits++ } },
      clock.Date, clock.setTimeout, clock.clearTimeout)
    return out
  } finally { stats.elapsed = clock.Date.now(); clock.close() }
}
test('trusted exact current master and CI gate authorize the SHA', async () => {
  assert.equal((await authorize()).source_sha, sha)
})
for (const [name, change, master, gate] of [
  ['PR run', { event: 'pull_request' }],
  ['wrong repository ID', { repository: { full_name: 'e-dialect/hinghwa-dict-web', id: 1 } }],
  ['wrong head repository ID', { head_repository: { full_name: 'e-dialect/hinghwa-dict-web', id: 1 } }],
  ['untrusted event', { event: 'workflow_run' }],
  ['fork', { head_repository: { full_name: 'someone/edialect.top', id: 1 } }],
  ['different workflow', { workflow_id: 99 }],
  ['failed CI', { conclusion: 'failure' }],
  ['incomplete CI', { status: 'in_progress' }],
  ['another latest run', { id: 124 }],
  ['wrong source SHA', { head_sha: 'b'.repeat(40) }],
  ['non-master', { head_branch: 'other' }],
  ['advanced master', {}, 'b'.repeat(40)],
  ['failed gate', {}, sha, 'failure'],
  ['missing gate', {}, sha, 'missing'],
  ['duplicate gate', {}, sha, 'duplicate'],
  ['skipped gate', {}, sha, 'skipped'],
]) {
  test(`reject ${name}`, async () => { await assert.rejects(authorize(change, master, gate)) })
}

test('completed successful run waits for queued aggregate gate metadata to converge', async () => {
  const stats = {}
  const jobs = [
    [{ name: 'CI gate', status: 'queued', conclusion: null }],
    [{ name: 'CI gate', status: 'in_progress', conclusion: null }],
    [{ name: 'CI gate', status: 'completed', conclusion: 'success' }],
  ]
  assert.equal((await authorize({}, sha, 'success', { jobs, stats })).source_sha, sha)
  assert.equal(stats.runReads, 3); assert.equal(stats.jobReads, 3); assert.equal(stats.elapsed, 10_000)
  assert.equal(stats.outputs.ci_run_id, '123'); assert.equal(stats.branchReads, 4)
})
test('missing gate and incomplete run can converge without choosing another SHA', async () => {
  const stats = {}
  const out = await authorize({}, sha, 'success', { stats,
    runs: [{ status: 'queued', conclusion: null }, { status: 'completed', conclusion: 'success' }],
    jobs: [[], [{ name: 'CI gate', status: 'completed', conclusion: 'success' }]],
  })
  assert.deepEqual(out, { source_sha: sha, ci_run_id: '123' }); assert.equal(stats.elapsed, 5_000)
})
test('pending or missing metadata stops at sixty seconds without publishing outputs', async () => {
  for (const jobs of [[], [{ name: 'CI gate', status: 'queued', conclusion: null }]]) {
    const stats = {}
    await assert.rejects(authorize({}, sha, 'success', { jobs: [jobs], stats }), /Timed out/)
    assert.equal(stats.elapsed, 60_000); assert.ok(stats.runReads <= 12); assert.deepEqual(stats.outputs, {})
  }
})
test('API request is bounded even when pending metadata request never resolves', async () => {
  const stats = {}
  await assert.rejects(authorize({}, sha, 'success', { blockRun: true, stats }), /Timed out/)
  assert.equal(stats.elapsed, 60_000); assert.deepEqual(stats.outputs, {})
  assert.ok(stats.requests.every(args => args.request.signal.aborted))
})
test('explicit run or gate failure never retries even after an earlier pending read', async () => {
  for (const failure of ['failure', 'cancelled', 'timed_out', 'action_required', 'neutral', 'skipped']) {
    const immediate = {}
    await assert.rejects(authorize({ conclusion: failure }, sha, 'success', { stats: immediate }))
    assert.equal(immediate.waits, 0); assert.equal(immediate.runReads, 1)
    const later = {}
    await assert.rejects(authorize({}, sha, 'success', { stats: later, jobs: [
      [{ name: 'CI gate', status: 'queued', conclusion: null }],
      [{ name: 'CI gate', status: 'completed', conclusion: failure }],
    ] }))
    assert.equal(later.waits, 1); assert.equal(later.elapsed, 5_000); assert.deepEqual(later.outputs, {})
  }
})
test('master advancement, changed trust or newer CI during the wait reject immediately', async () => {
  for (const options of [
    { masters: [sha, 'b'.repeat(40)] },
    { runs: [{}, { head_repository: { full_name: 'untrusted/fork', id: 1 } }] },
    { newerAt: 1 },
    { candidates: [[{ id: 123 }]] },
  ]) {
    const stats = {}
    await assert.rejects(authorize({}, sha, 'success', { ...options, stats,
      jobs: [[{ name: 'CI gate', status: 'queued', conclusion: null }]],
    }))
    assert.ok(stats.waits <= 1); assert.ok(stats.elapsed <= 5_000); assert.deepEqual(stats.outputs, {})
  }
})
test('final master recheck refuses an advancement after a successful gate response', async () => {
  const stats = {}
  await assert.rejects(authorize({}, sha, 'success', { masters: [sha, 'b'.repeat(40)], stats }), /master advanced/)
  assert.equal(stats.waits, 0); assert.deepEqual(stats.outputs, {})
})
test('unknown status and completed-without-conclusion metadata fail immediately', async () => {
  for (const options of [
    { runs: [{ status: 'unexpected' }] },
    { runs: [{ status: 'completed', conclusion: null }] },
    { jobs: [[{ name: 'CI gate', status: 'unexpected', conclusion: null }]] },
    { jobs: [[{ name: 'CI gate', status: 'completed', conclusion: null }]] },
  ]) {
    const stats = {}
    await assert.rejects(authorize({}, sha, 'success', { ...options, stats }))
    assert.equal(stats.waits, 0); assert.deepEqual(stats.outputs, {})
  }
})
test('duplicate gates and API errors fail closed without a polling retry', async () => {
  for (const options of [
    { jobs: [[{ name: 'CI gate', status: 'completed', conclusion: 'success' }, { name: 'CI gate', status: 'completed', conclusion: 'success' }]] },
    { apiError: true },
  ]) {
    const stats = {}
    await assert.rejects(authorize({}, sha, 'success', { ...options, stats }))
    assert.equal(stats.waits, 0); assert.deepEqual(stats.outputs, {})
  }
})

test('publication requires completed exact-SHA smoke with every route and asset kind', () => {
  const good = {
    result: 'PASS', cleanup: 'PASS', sourceSHA: sha,
    routes: ['/', '/Home', '/About', '/login'], javaScriptAssets: 3, cssAssets: 2,
    imageId: 'sha256:' + 'c'.repeat(64), containerPort: 8080,
    nonRoot: true, readOnlyRootFilesystem: true, productionAPI: true, sameOriginEntryAssets: true, browserAcceptance,
    runtimeLimits: {
      capDrop: ['ALL'], securityOpt: ['no-new-privileges:true'],
      memoryBytes: 128 * 1024 * 1024, memorySwapBytes: 128 * 1024 * 1024,
      nanoCpus: 500_000_000, pidsLimit: 64,
      tmpfs: { '/tmp': 'rw,noexec,nosuid,size=32m' },
    },
  }
  assert.equal(verifiedRuntimeImage(good, sha), good.imageId)
  for (const change of [
    { result: 'FAIL' }, { sameOriginAssets: true }, { browserAcceptance: undefined },
    { browserAcceptance: { ...browserAcceptance, verified: true } },
    { browserAcceptance: { ...browserAcceptance, dependencyInventoryComplete: true } },
    { browserAcceptance: { ...browserAcceptance, knownExternalDependencies: [{ url: 'https://unreviewed.example/script.js' }] } },
    { browserAcceptance: { ...browserAcceptance, pendingPaths: [] } }, { cleanup: 'FAIL' }, { sourceSHA: 'b'.repeat(40) },
    { routes: ['/'] }, { cssAssets: 0 }, { javaScriptAssets: 0 }, { imageId: '' },
    { productionAPI: false }, { sameOriginEntryAssets: false }, { containerPort: 80 }, { nonRoot: false }, { readOnlyRootFilesystem: false },
    { runtimeLimits: { ...good.runtimeLimits, pidsLimit: 128 } },
  ]) {
    assert.throws(() => verifiedRuntimeImage({ ...good, ...change }, sha))
  }
})

// Exercise the actual final pre-publication reauthorization as well as initial authorization.
const prepublishAuthorization = yaml.split('      - name: Recheck trusted master and latest exact-SHA CI before publication')[1]
  .split('          script: |\n')[1].split('      - name: Publish tested image and immutable manifest')[0]
  .split('\n').map(line => line.replace(/^            /, '')).join('\n')
test('publication rechecks latest CI and current branch after the image build and smoke', async () => {
  assert.equal((await authorize({}, sha, 'success', prepublishAuthorization)).source_sha, sha)
  await assert.rejects(authorize({ status: 'in_progress' }, sha, 'success', prepublishAuthorization))
  await assert.rejects(authorize({}, 'b'.repeat(40), 'success', prepublishAuthorization))
  await assert.rejects(authorize({}, sha, 'failure', prepublishAuthorization))
})

test('initial and final publication checks use the same bounded trust policy', async () => {
  assert.equal(prepublishAuthorization.trim(), authorization.trim())
  const stats = {}
  assert.equal((await authorize({}, sha, 'success', { code: prepublishAuthorization, stats, jobs: [
    [{ name: 'CI gate', status: 'queued', conclusion: null }],
    [{ name: 'CI gate', status: 'completed', conclusion: 'success' }],
  ] })).source_sha, sha)
  assert.equal(stats.elapsed, 5_000); assert.equal(stats.jobReads, 2)
})
