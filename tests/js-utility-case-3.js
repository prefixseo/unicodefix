const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

class Element {
  constructor(id='') { this.id=id; this.value=''; this.textContent=''; this.hidden=false; this.dataset={}; this.listeners={}; this.children=[]; this.classList={add(){},remove(){},toggle(){return false;}}; this.attributes={}; }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn); }
  dispatch(type) { for (const fn of this.listeners[type] || []) fn({target:this}); }
  replaceChildren(...children) { this.children=children; if (children.length) this.value=children[0].value; }
  setAttribute(k,v) { this.attributes[k]=v; }
  focus() {}
  select() {}
}
function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (m,e) => {
    if (e[0]==='#') return String.fromCodePoint(e[1].toLowerCase()==='x' ? parseInt(e.slice(2),16) : Number(e.slice(1)));
    return ({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"})[e.toLowerCase()] || m;
  });
}
function createPage(slug) {
  const ids = ['tool-input','tool-output','tool-mode','tool-status','input-count','output-count','convert-btn','clear-btn','sample-btn','copy-btn','download-btn'];
  const elements = Object.fromEntries(ids.map(id => [id,new Element(id)]));
  elements['tool-mode'].replaceChildren(...[['encode','Encode / Inspect'],['decode','Decode']].map(([value,text])=>Object.assign(new Element(),{value,textContent:text})));
  const document = {
    querySelector(sel) { if (sel.startsWith('#')) return elements[sel.slice(1)] || null; return null; },
    querySelectorAll() { return []; },
    createElement(tag) {
      if (tag==='option') return new Element();
      if (tag==='textarea') {
        const el = new Element();
        Object.defineProperty(el,'innerHTML',{set(v){this.value=decodeEntities(v);}});
        return el;
      }
      return new Element();
    }
  };
  const context = {
    console, document, location:{pathname:'/'+slug+'/'}, window:null,
    TextEncoder, TextDecoder, Uint8Array, String, Array, Object, Number, Math, RegExp, Error,
    Intl, atob:s=>Buffer.from(s,'base64').toString('binary'),
    btoa:s=>Buffer.from(s,'binary').toString('base64'),
    navigator:{}
  };
  context.window=context;
  vm.createContext(context);
  for (const file of ['preeti-converter.js','bamini-converter.js','bijoy-converter.js','fmabhaya-converter.js','anmollipi-converter.js','chanakya-converter.js']) {
    vm.runInContext(fs.readFileSync(path.join(root,'assets/js',file),'utf8'),context,{filename:file});
  }
  vm.runInContext(fs.readFileSync(path.join(root,'assets/js/tools.js'),'utf8'),context,{filename:'tools.js'});
  return {elements,run(input,mode) {
    elements['tool-input'].value=input;
    if (mode) elements['tool-mode'].value=mode;
    elements['convert-btn'].dispatch('click');
    return {output:elements['tool-output'].value,status:elements['tool-status'].textContent};
  }};
}

const checks = [
  ['ascii-converter','72 105','decode','Hi'],
];
for (const [slug,input,mode,expected] of checks) { const result=createPage(slug).run(input,mode); assert.equal(result.output,expected,slug+' / '+mode+' output'); assert.match(result.status,/Done|Normalized|Already normalized/,slug+' / '+mode+' status'); }
console.log('Utility batch 3 case 3 passed');
