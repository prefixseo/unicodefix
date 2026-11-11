const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const context = { console };
context.window = context;
vm.createContext(context);

const engines = [
  ['preeti-converter.js', 'UnicodeFixPreeti', 'toUnicode', 'g]kfnL efiff'],
  ['bamini-converter.js', 'UnicodeFixBamini', 'toUnicode', 'KUfd;'],
  ['bijoy-converter.js', 'UnicodeFixBijoy', 'toUnicode', 'Avwg evsjvq Mvb MvB'],
  ['fmabhaya-converter.js', 'UnicodeFixFMAbhaya', 'toUnicode', "› ,xldj ,iaik rgls'"],
  ['anmollipi-converter.js', 'UnicodeFixAnmolLipi', 'toUnicode', 'gurU'],
  ['chanakya-converter.js', 'UnicodeFixChanakya', 'toUnicode', 'ÖæÚUÌ °·¤ ×ãæÙ Îðàæ ãñÐ'],
];

for (const [file, apiName, method, sample] of engines) {
  const source = fs.readFileSync(path.join(root, 'assets/js', file), 'utf8');
  vm.runInContext(source, context, { filename: file });
  const api = context[apiName];
  assert.ok(api, apiName + ' must be exported after all engine scripts execute');
  assert.equal(typeof api[method], 'function', apiName + '.' + method + ' must be callable');
  const result = api[method](sample);
  assert.equal(typeof result, 'string', apiName + ' must return a string');
  assert.ok(result.length > 0, apiName + ' must return a non-empty result for its smoke sample');
  const reverse = apiName === 'UnicodeFixChanakya' ? api.toChanakya : api.fromUnicode;
  assert.equal(typeof reverse, 'function', apiName + ' reverse method must be callable');
  assert.equal(typeof reverse(result), 'string', apiName + ' reverse method must return a string');
}

const toolsJs = fs.readFileSync(path.join(root, 'assets/js/tools.js'), 'utf8');
assert.match(toolsJs, /action==='decode'\?decodeCodePoints\(v\)/, 'Unicode Text Converter Decode must use the decoder');
assert.ok(toolsJs.includes('isInvisibleSpace(ch)||/\\p{Cf}/u.test(ch)'), 'Invisible cleanup must remove Unicode format controls including ZWNJ and ZWJ');
console.log('Legacy engine isolation and Unicode utility smoke checks passed.');
