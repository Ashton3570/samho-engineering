// Verify visitor behavior without changing browser storage or production data.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../src/opening-v3/session.js'), 'utf8');

function visit({seen = false, type = 'navigate', hash = '', reduced = false,
                blocked = false, referrer = ''} = {}) {
  const storage = new Map(seen ? [['samho:opening-seen:v1', '1']] : []);
  const classes = new Set();
  const context = {
    URL, window: {},
    performance: {getEntriesByType: () => [{type}]},
    location: {hash, origin: 'https://samhoengineering.com'},
    document: {referrer, documentElement: {classList: {
      add: name => classes.add(name), remove: name => classes.delete(name)
    }}},
    matchMedia: () => ({matches: reduced}),
    sessionStorage: {
      getItem(key) { if (blocked) throw Error('Storage unavailable'); return storage.get(key); },
      setItem(key, value) { if (blocked) throw Error('Storage unavailable'); storage.set(key, value); }
    },
    setTimeout: () => {}
  };
  vm.runInNewContext(source, context);
  return {policy: context.window.samhoOpening, classes, storage};
}

const cases = [
  ['first visit', {}, true],
  ['return from product page', {seen: true}, false],
  ['reload after watching', {seen: true, type: 'reload'}, true],
  ['back navigation', {seen: true, type: 'back_forward'}, false],
  ['direct anchor link', {hash: '#main'}, false],
  ['reduced motion preference', {reduced: true, type: 'reload'}, false],
  ['blocked storage, first visit', {blocked: true}, true],
  ['blocked storage, internal navigation', {blocked: true, referrer: 'https://samhoengineering.com/products/'}, false],
  ['blocked storage, reload', {blocked: true, type: 'reload', referrer: 'https://samhoengineering.com/products/'}, true]
];
for (const [name, options, expected] of cases) {
  const result = visit(options);
  assert.equal(result.policy.shouldPlay, expected, name);
  assert.equal(result.classes.has('opening-pending'), expected, `${name}: first paint`);
  assert.doesNotThrow(() => result.policy.markSeen(), `${name}: completion`);
  if (!options.blocked) assert.equal(result.storage.get('samho:opening-seen:v1'), '1');
}
console.log(`${cases.length} opening session scenarios pass.`);
