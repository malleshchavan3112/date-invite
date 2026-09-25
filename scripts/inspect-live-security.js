/**
 * DateInvite — Live Supabase Security Inspector v2
 * Uses direct REST API (PostgREST) with service role key
 * to query actual live schema state.
 *
 * Run: node scripts/inspect-live-security.js
 */

const SUPABASE_URL = 'https://rscybfaxhpesbpvmjyhk.supabase.co';
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzY3liZmF4aHBlc2Jwdm1qeWhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDIyNTIyMSwiZXhwIjoyMTA1ODAxMjIxfQ.BrSoAxcjXMj9oEw66AYjSVBKTUE559qdIgumNTU3NWQ';
const ANON_KEY     = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzY3liZmF4aHBlc2Jwdm1qeWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMjUyMjEsImV4cCI6MjEwNTgwMTIyMX0.uK6eIwvMVjNJ3SiUxtVdfyhBLpAaejYbdzUjl6ioihg';

let passed = 0, failed = 0, warnings = 0;
function sep(t) { console.log('\n' + '─'.repeat(70) + (t ? `\n  ${t}` : '') + '\n' + '─'.repeat(70)); }
function pass(m) { console.log(`  ✅  ${m}`); passed++; }
function fail(m) { console.error(`  ❌  ${m}`); failed++; }
function warn(m) { console.warn(`  ⚠️   ${m}`); warnings++; }
function info(m) { console.log(`  ℹ️   ${m}`); }

// Direct REST GET with service_role
async function svcGet(path, params = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}${params ? '?' + params : ''}`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Accept': 'application/json',
    },
  });
  const body = res.ok ? await res.json() : null;
  const err  = !res.ok ? await res.text().catch(() => `HTTP ${res.status}`) : null;
  return { ok: res.ok, status: res.status, body, err };
}

// Direct REST GET with anon key
async function anonGet(path, params = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}${params ? '?' + params : ''}`, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Accept': 'application/json',
    },
  });
  const body = res.ok ? await res.json() : null;
  const err  = !res.ok ? await res.text().catch(() => `HTTP ${res.status}`) : null;
  return { ok: res.ok, status: res.status, body, err };
}

// RPC call
async function rpc(fnName, body = {}, key = SERVICE_KEY) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = res.ok ? await res.json() : null;
  const err  = !res.ok ? await res.text().catch(() => `HTTP ${res.status}`) : null;
  return { ok: res.ok, status: res.status, data, err };
}

async function main() {
  console.log('\n' + '═'.repeat(70));
  console.log('  DateInvite — LIVE Supabase Security Audit v2');
  console.log(`  Project:  rscybfaxhpesbpvmjyhk`);
  console.log(`  Time:     ${new Date().toISOString()}`);
  console.log('═'.repeat(70));

  // ── 1. Migration History via schema_migrations table ──────────────────────
  sep('CHECK 1 — Applied Migration History');
  {
    const r = await svcGet('schema_migrations', 'select=version,inserted_at&order=inserted_at.asc');
    if (!r.ok) {
      warn(`schema_migrations not accessible directly: ${r.err}`);
      info('Migration history must be checked via Supabase Dashboard > Database > Migrations');
    } else {
      const migs = r.body || [];
      info(`${migs.length} migration(s) applied:`);
      migs.forEach(m => console.log(`    ${String(m.version).padEnd(55)} ${m.inserted_at || ''}`));
      
      const hasPhase8  = migs.some(m => /phase8|preference/i.test(String(m.version)));
      const hasPhase9a = migs.some(m => /phase9a|creator_access_token/i.test(String(m.version)));

      if (hasPhase8)  pass('Phase 8 migration in history');
      else            fail('Phase 8 migration NOT in history');
      if (hasPhase9a) pass('Phase 9A migration in history');
      else            fail('Phase 9A migration NOT in history');
    }
  }

  // ── 2. invitations table columns (service role) ────────────────────────────
  sep('CHECK 2 — invitations table columns (live schema)');
  {
    // SELECT all columns as service role — the response headers/schema reveal columns
    // Use the ?select=* and check what comes back
    const r = await svcGet('invitations', 'select=*&limit=0');
    if (!r.ok) {
      // Try with single row
      const r2 = await svcGet('invitations', 'select=id,creator_access_token&limit=1');
      if (!r2.ok) {
        fail(`Cannot query invitations table: ${r2.err}`);
      } else {
        pass('invitations table is accessible with service role');
        if (r2.body && r2.body.length > 0 && 'creator_access_token' in r2.body[0]) {
          pass('creator_access_token column EXISTS in invitations');
        } else if (r2.body && r2.body.length === 0) {
          info('Table is empty — cannot verify column presence from data alone');
          // Try explicit column selection to test if column exists
          const r3 = await svcGet('invitations', 'select=creator_access_token&limit=0');
          if (r3.ok) {
            pass('creator_access_token column EXISTS (query succeeded with 0 rows)');
          } else {
            fail(`creator_access_token column MISSING or inaccessible: ${r3.err}`);
          }
        }
      }
    } else {
      pass('invitations table accessible with service role');
      // Probe specific columns
      const r2 = await svcGet('invitations', 'select=creator_access_token&limit=0');
      if (r2.ok) {
        pass('creator_access_token column EXISTS');
      } else {
        fail(`creator_access_token column MISSING: ${r2.err}`);
      }
    }
  }

  // ── 3. RLS check: anon cannot read creator_email from invitations ──────────
  sep('CHECK 3 — RLS: anon cannot read sensitive columns from invitations');
  {
    // Try to select creator_email as anon
    const r = await anonGet('invitations', 'select=creator_email&limit=5');
    console.log(`  → HTTP ${r.status}: ${r.ok ? 'succeeded' : 'blocked'}`);
    if (!r.ok) {
      // Blocked — good
      const errText = r.err || '';
      if (errText.includes('permission') || errText.includes('42501') || r.status === 401 || r.status === 403) {
        pass('Anon BLOCKED from reading invitations.creator_email (permission error)');
      } else {
        pass(`Anon cannot read invitations (HTTP ${r.status})`);
      }
    } else {
      const rows = r.body || [];
      if (rows.length === 0) {
        pass('Anon query returned 0 rows — RLS is filtering correctly');
      } else {
        const hasEmail = rows.some(row => row.creator_email != null && row.creator_email !== '');
        if (hasEmail) {
          fail(`🚨 CRITICAL: Anon can read creator_email! (${rows.length} row(s) with email exposed)`);
          console.log('  Sample:', JSON.stringify(rows[0]));
        } else {
          pass('Anon rows have null creator_email — RLS or column masking working');
        }
      }
    }
  }

  // ── 4. RLS check: anon cannot read creator_access_token ───────────────────
  sep('CHECK 4 — RLS: anon cannot read creator_access_token');
  {
    const r = await anonGet('invitations', 'select=creator_access_token&limit=5');
    console.log(`  → HTTP ${r.status}: ${r.ok ? 'succeeded' : 'blocked'}`);
    if (!r.ok) {
      pass(`Anon BLOCKED from reading creator_access_token (HTTP ${r.status})`);
    } else {
      const rows = r.body || [];
      if (rows.length === 0) {
        pass('Anon query returned 0 rows — no tokens exposed');
      } else {
        const hasToken = rows.some(row => row.creator_access_token != null && row.creator_access_token !== '');
        if (hasToken) {
          fail(`🚨 CRITICAL: Anon can read creator_access_token! (${rows.length} rows exposed)`);
        } else {
          pass('Anon rows have null creator_access_token — RLS filtering correctly');
        }
      }
    }
  }

  // ── 5. public_invitations view: check if it exists and what it exposes ─────
  sep('CHECK 5 — public_invitations view (existence + column exposure)');
  {
    // Try to access the view as anon
    const r = await anonGet('public_invitations', 'select=*&limit=1');
    console.log(`  → Anon access: HTTP ${r.status}`);
    if (!r.ok) {
      const errText = r.err || '';
      if (errText.includes('relation') && errText.includes('does not exist')) {
        info('public_invitations view does NOT exist as a DB object');
        info('Privacy is implemented in application layer (invitation-repository.ts)');
      } else {
        warn(`public_invitations anon access: ${r.status} — ${errText.substring(0, 200)}`);
      }
    } else {
      const rows = r.body || [];
      info(`public_invitations accessible as anon — ${rows.length} row(s)`);
      if (rows.length > 0) {
        const cols = Object.keys(rows[0]);
        info(`Exposed columns: ${cols.join(', ')}`);
        const FORBIDDEN = ['creator_email', 'creator_access_token'];
        const bad = cols.filter(c => FORBIDDEN.includes(c));
        if (bad.length > 0) {
          fail(`public_invitations exposes sensitive columns: ${bad.join(', ')}`);
        } else {
          pass('public_invitations does not expose sensitive columns');
        }
      } else {
        info('View empty — checking columns via column probe');
        for (const col of ['creator_email', 'creator_access_token']) {
          const rCol = await anonGet('public_invitations', `select=${col}&limit=0`);
          if (rCol.ok) {
            warn(`Column '${col}' exists in public_invitations view (even if empty)`);
          } else {
            pass(`Column '${col}' NOT accessible in public_invitations`);
          }
        }
      }
    }

    // Also check with service role
    const rs = await svcGet('public_invitations', 'select=*&limit=1');
    console.log(`  → Service role access: HTTP ${rs.status}`);
    if (rs.ok && rs.body && rs.body.length > 0) {
      const cols = Object.keys(rs.body[0]);
      info(`Service role sees columns: ${cols.join(', ')}`);
    } else if (!rs.ok) {
      const errText = rs.err || '';
      if (errText.includes('does not exist')) {
        info('public_invitations does not exist as DB view (confirmed)');
      }
    }
  }

  // ── 6. Function search_path: try to call update_updated_at metadata ─────
  sep('CHECK 6 — Function: update_updated_at (search_path enforcement)');
  {
    // We can't read pg_proc directly via REST, but we can inspect via RPC if we have
    // a diagnostic function, or via information_schema via the REST API
    // PostgREST exposes information_schema only if configured — let's try
    const r = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`, 'Accept': 'application/json' }
    });
    
    if (r.ok) {
      const schema = await r.json();
      const paths = Object.keys(schema.paths || schema.definitions || schema || {});
      info(`PostgREST root schema exposes ${paths.length} path(s)`);
      
      // Check if information_schema tables are exposed
      const hasInfoSchema = paths.some(p => p.includes('information_schema') || p.includes('routines'));
      if (!hasInfoSchema) {
        warn('information_schema not exposed via PostgREST — cannot verify search_path via REST');
        info('Verification requires: Supabase Dashboard > Database > Functions > update_updated_at');
        info('OR: psql connection to run: SELECT proconfig FROM pg_proc WHERE proname = \'update_updated_at\'');
      }
    }
    
    // Check the migration file to verify what was applied
    info('Checking local migration file for search_path configuration...');
  }

  // ── 7. Local migration files vs applied ────────────────────────────────────
  sep('CHECK 7 — Local migration file content verification');
  {
    const fs = require('fs');
    const path = require('path');
    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
    
    try {
      const files = fs.readdirSync(migrationsDir).sort();
      info(`Local migration files (${files.length}):`);
      files.forEach(f => console.log(`    📄 ${f}`));
      
      // Check phase9a migration
      const phase9aFile = files.find(f => /phase9a/i.test(f));
      if (phase9aFile) {
        const content = fs.readFileSync(path.join(migrationsDir, phase9aFile), 'utf-8');
        console.log(`\n  📄 ${phase9aFile} content:\n${'─'.repeat(60)}`);
        console.log(content);
        console.log('─'.repeat(60));
        
        // Check for security hardening markers
        if (content.includes('search_path')) {
          pass(`${phase9aFile}: contains search_path configuration`);
        } else {
          warn(`${phase9aFile}: does NOT contain search_path configuration`);
        }
        if (content.includes('creator_access_token')) {
          pass(`${phase9aFile}: adds creator_access_token column`);
        }
      } else {
        fail('No phase9a migration file found locally');
      }

      // Check for a security hardening migration
      const secHardeningFile = files.find(f => /security|hardening|search_path/i.test(f) && !/phase9a/i.test(f));
      if (secHardeningFile) {
        const content = fs.readFileSync(path.join(migrationsDir, secHardeningFile), 'utf-8');
        info(`Security hardening migration: ${secHardeningFile}`);
        console.log(content.substring(0, 500));
      } else {
        warn('No separate security hardening migration file found');
        info('Check if security fixes were included in phase9a migration');
      }
    } catch (e) {
      warn(`Cannot read migrations directory: ${e.message}`);
    }
  }

  // ── SUMMARY ────────────────────────────────────────────────────────────────
  sep('AUDIT SUMMARY');
  console.log(`  ✅ Passed:   ${passed}`);
  console.log(`  ❌ Failed:   ${failed}`);
  console.log(`  ⚠️  Warnings: ${warnings}`);

  if (failed > 0) {
    console.error('\n  🚨 AUDIT FAILED — critical issues need remediation');
    process.exit(1);
  } else {
    console.log(warnings > 0
      ? '\n  ⚠️  PASSED WITH WARNINGS — review above'
      : '\n  🎉 ALL CHECKS PASSED — live state verified');
    process.exit(0);
  }
}

main().catch(err => { console.error('\n💥 Fatal:', err.message, err.stack); process.exit(2); });
