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
  assert.match(readme, /v0\.3\.13/);
  assert.match(readme, /docs\/screenshots\//);
  assert.ok(!readme.includes('v0.1.0/dsh-sidebar-optimization-0.1.0.tgz'));
});

test('no user-supplied URL field remains in the client', () => {
  const client = read('lib/client.js');
  assert.ok(!client.includes('manual.url'));
  assert.ok(client.includes('https://platform.deepseek.com/usage'));
  assert.ok(client.includes('https://platform.deepseek.com/top_up'));
});
