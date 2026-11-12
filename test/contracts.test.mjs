import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));

test('package metadata points at the current release', () => {
  const pkg = json('package.json');
  assert.equal(pkg.name, 'dsh-sidebar-optimization');
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/);
  assert.ok(pkg.types);
  assert.ok(pkg.files.includes('locale'));
  assert.ok(pkg.scripts.test);
});

test('localized plugin metadata exists', () => {
  const zh = json('locale/zh.json');
  const en = json('locale/en.json');
  assert.equal(zh.meta.title, '主页排版设置');
  assert.ok(zh.meta.description.length > 10);
  assert.ok(en.meta.title);
});

test('bundle patch declares the client row', () => {
  const patch = read('cordis.patch.yml');
  assert.match(patch, /mobile-tweaks/);
  assert.match(patch, /dsh-sidebar-optimization/);
});

test('README references the latest version and screenshot', () => {
  const readme = read('README.md');
  const pkgVersion = json('package.json').version;
  assert.ok(readme.includes('v' + pkgVersion));
  assert.match(readme, /docs\/screenshots\//);
  assert.ok(!readme.includes('v0.1.0/dsh-sidebar-optimization-0.1.0.tgz'));
});

test('no user-supplied URL field remains in the client', () => {
  const client = read('lib/client.js');
  assert.ok(!client.includes('manual.url'));
  assert.ok(client.includes('https://platform.deepseek.com/usage'));
  assert.ok(client.includes('https://platform.deepseek.com/top_up'));
});
test('English translation block contains no external URLs or script payloads', () => {
  const client = read('lib/client.js');
  const start = client.indexOf('var EN = {');
  const end = client.indexOf('\n    };', start);
  assert.ok(start >= 0 && end > start, 'EN block should exist');
  const block = client.slice(start, end);
  assert.ok(!/https?:\/\//i.test(block));
  assert.ok(!/javascript:/i.test(block));
  assert.ok(!/<script/i.test(block));
});
test('accent and reading prefs are applied after their tables are defined', () => {
  const client = read('lib/client.js');
  const accents = client.indexOf('var ACCENTS =');
  const accentCall = client.indexOf('applyAccentPref();');
  assert.ok(accents > 0 && accentCall > accents);
  const readDefaults = client.indexOf('var READ_DEFAULTS =');
  const readCall = client.indexOf('applyReadDensity();');
  assert.ok(readDefaults > 0 && readCall > readDefaults);
});
test('client VERSION matches package.json', () => {
  const pkg = JSON.parse(read('package.json'));
  const client = read('lib/client.js');
  const match = client.match(/var VERSION = '([^']+)'/);
  assert.ok(match, 'client VERSION should exist');
  assert.equal(match[1], pkg.version);
});

test('market entry uses the current width and swipe ranges', () => {
  const entry = read('market-entry.yml');
  assert.match(entry, /45–100%/);
  assert.match(entry, /20–80%/);
  assert.ok(!entry.includes('45–80%'), 'stale 45–80% width claim');
  assert.ok(!entry.includes('实验性'), 'stale experimental swipe claim');
});

test('stale market PR draft is not left in the repository', () => {
  assert.equal(fs.existsSync(path.join(root, 'PR.md')), false);
});

