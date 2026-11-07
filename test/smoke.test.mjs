import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function makeEl() {
  const el = {
    children: [],
    style: { setProperty() {}, removeProperty() {} },
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    appendChild(child) { this.children.push(child); return child; },
    insertBefore(child) { this.children.unshift(child); return child; },
    removeChild(child) { this.children = this.children.filter((c) => c !== child); },
    remove() {},
    addEventListener(type, fn) { this.handlers = this.handlers || {}; this.handlers[type] = fn; },
    click() { if (this.handlers && this.handlers.click) this.handlers.click({ preventDefault() {}, stopPropagation() {} }); },
    setAttribute() {}, getAttribute() { return null; },
    querySelector() { return null; }, querySelectorAll() { return []; },
    getBoundingClientRect() { return { left: 0, top: 0, width: 200, height: 34, bottom: 34 }; },
    textContent: '', value: '', checked: false, type: '', id: '', className: '', innerHTML: '',
    nextSibling: null, firstChild: null,
  };
  return el;
}

const foot = makeEl();
const body = makeEl();
const doc = {
  head: makeEl(),
  body,
  documentElement: makeEl(),
  createElement: () => makeEl(),
  createTextNode: () => ({}),
  getElementById: () => null,
  querySelector: (selector) => (String(selector).includes('footArea') ? foot : null),
  querySelectorAll: () => [],
  addEventListener() {},
  execCommand() { return true; },
};

globalThis.window = {
  innerWidth: 400, innerHeight: 800, visualViewport: null,
  matchMedia: () => ({ matches: true }),
  addEventListener() {},
  __ModuleLoader__: { load(mod) { globalThis.__pluginModule = mod; } },
};
globalThis.document = doc;
Object.defineProperty(globalThis, 'navigator', { value: { language: 'zh-CN', clipboard: { writeText: async () => {} } }, configurable: true });
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.requestAnimationFrame = () => 0;
globalThis.setInterval = () => 0;
globalThis.clearInterval = () => {};
globalThis.setTimeout = () => 0;
globalThis.clearTimeout = () => {};
globalThis.MutationObserver = class { observe() {} disconnect() {} };
globalThis.getComputedStyle = () => ({ position: 'static' });

require('../lib/client.js');

test('client plugin applies and installs the footer entry', () => {
  const plugin = globalThis.__pluginModule.factory(() => ({}));
  assert.equal(plugin.name, 'mobile-tweaks');
  plugin.apply({});
  assert.equal(globalThis.window.__dshTweaksLastError, undefined);
  assert.ok(foot.children.length >= 1);
  assert.match(foot.children[0].textContent, /主页排版设置/);
});

test('settings card opens with the plugin title and version', () => {
  foot.children[0].click();
  const overlay = body.children[0];
  assert.ok(overlay, 'overlay should be appended');
  const texts = [];
  (function walk(el) {
    if (!el) return;
    if (el.textContent) texts.push(el.textContent);
    for (const child of el.children || []) walk(child);
  })(overlay);
  assert.ok(texts.includes('主页排版设置'));
  assert.ok(texts.some((t) => /^v0\.3\.\d+$/.test(t)));
  const tabs = [];
  (function walk(el) {
    if (el && typeof el.className === 'string' && el.className.split(/\s+/).indexOf('dsh-tweaks-tab') >= 0) tabs.push(el);
    for (const child of (el && el.children) || []) walk(child);
  })(overlay);
  assert.equal(tabs.length, 3);
  assert.deepEqual(tabs.map((t) => t.textContent), ['界面', '显示', '通用']);
  assert.ok(tabs[0].className.indexOf('is-active') >= 0);
  assert.ok(texts.includes('100%'));
  assert.ok(texts.includes('显示后自动隐藏（秒）'));
  assert.ok(texts.includes('设置备份与恢复'));
  assert.ok(texts.includes('界面动效（含分组切换与展开）'));
  assert.ok(texts.includes('重置 ☰ 位置'));
  assert.ok(texts.some((t) => t.indexOf('恢复默认会清除') >= 0));
  assert.ok(texts.some((t) => t.indexOf('不会影响') >= 0));
});
