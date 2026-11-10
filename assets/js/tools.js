(()=>{'use strict';
const $=s=>document.querySelector(s);
const input=$('#tool-input'),output=$('#tool-output');
const count=(el,target)=>{if(el&&target)target.textContent=Array.from(el.value).length.toLocaleString()+' characters';};
const tool=location.pathname.split('/').filter(Boolean)[0]||'';
const mode=$('#tool-mode');
const status=$('#tool-status');
const setModes=(items)=>{if(!mode)return;mode.replaceChildren(...items.map(([value,label])=>{const o=document.createElement('option');o.value=value;o.textContent=label;return o;}));};
const modeSets={
 'preeti-to-unicode':[['preeti-to-unicode','Preeti → Unicode'],['unicode-to-preeti','Unicode → Preeti']],
 'unicode-to-preeti':[['unicode-to-preeti','Unicode → Preeti'],['preeti-to-unicode','Preeti → Unicode']],
 'bamini-to-unicode':[['bamini-to-unicode','Bamini → Unicode'],['unicode-to-bamini','Unicode → Bamini']],
 'unicode-to-bamini':[['unicode-to-bamini','Unicode → Bamini'],['bamini-to-unicode','Bamini → Unicode']],
 'bijoy-to-unicode':[['bijoy-to-unicode','Bijoy → Unicode'],['unicode-to-bijoy','Unicode → Bijoy']],
 'unicode-to-bijoy':[['unicode-to-bijoy','Unicode → Bijoy'],['bijoy-to-unicode','Bijoy → Unicode']],
 'fm-abaya-to-unicode':[['fm-abaya-to-unicode','FM Abhaya → Unicode'],['unicode-to-fm-abaya','Unicode → FM Abhaya']],
 'unicode-to-fm-abaya':[['unicode-to-fm-abaya','Unicode → FM Abhaya'],['fm-abaya-to-unicode','FM Abhaya → Unicode']],
 'unicode-to-non-unicode':[['preeti','Preeti — Nepali'],['bamini','Bamini — Tamil'],['bijoy','Bijoy / SutonnyMJ — Bengali'],['fm-abaya','FM Abhaya — Sinhala']],
 'unicode-normalizer':[['NFC','NFC – Canonical composition'],['NFD','NFD – Canonical decomposition'],['NFKC','NFKC – Compatibility composition'],['NFKD','NFKD – Compatibility decomposition']],
 'remove-invisible-characters':[['remove','Remove invisible characters'],['report','Show invisible character report']],
 'text-cleaner':[['trim','Trim line edges'],['spaces','Collapse repeated spaces'],['blank','Remove repeated blank lines'],['all','Apply all cleanup rules']],
 'text-case-converter':[['upper','UPPERCASE'],['lower','lowercase'],['title','Title Case'],['sentence','Sentence case'],['toggle','tOGGLE cASE']],
 'word-character-counter':[['analyze','Analyze text']]
};
if(modeSets[tool])setModes(modeSets[tool]);
const samples={
 'preeti-to-unicode':'g]kfnL efiff',
 'unicode-to-preeti':'नेपाल भाषा',
 'bamini-to-unicode':'KUfd;',
 'unicode-to-bamini':'முருகன்',
 'bijoy-to-unicode':'Avwg evsjvq Mvb MvB',
 'unicode-to-bijoy':'আমি বাংলায় গান গাই',
 'fm-abaya-to-unicode':"› ,xldj ,iaik rgls'",
 'unicode-to-fm-abaya':'ශ්‍රී ලංකාව ලස්සන රටකි.',
 'unicode-to-non-unicode':'नेपाल भाषा',
 'unicode-text-converter':'Hello Unicode — नमस्ते दुनिया 🌍',
 'html-encode-decode':'UnicodeFix & text <tools> "work"',
 'url-encode-decode':'UnicodeFix text tools & utilities',
 'base64-encode-decode':'UnicodeFix — café 🌍',
 'unicode-normalizer':'Café — naïve — ﬁancée',
 'utf8-encoder-decoder':'UnicodeFix — café 🌍',
 'remove-invisible-characters':'Visible​Text﻿ with invisible marks',
 'text-cleaner':'  UnicodeFix   text  \n\n\n   tools   ',
 'unicode-escape-converter':'UnicodeFix — नमस्ते 🌍',
 'ascii-converter':'UnicodeFix 123!',
 'text-case-converter':'unicodefix makes text easier to work with.',
 'word-character-counter':'Count words, characters and lines.\nUnicodeFix makes text tools simple.'
};
const toBytesHex=s=>Array.from(new TextEncoder().encode(s),b=>b.toString(16).padStart(2,'0')).join(' ');
const fromHexBytes=s=>{const clean=s.trim();if(!clean)return '';const tokens=clean.split(/[\s,]+/);if(tokens.some(x=>! /^(?:[0-9a-fA-F]{2})$/.test(x)))throw Error('Enter hexadecimal bytes as two-digit values separated by spaces.');return new TextDecoder('utf-8',{fatal:true}).decode(new Uint8Array(tokens.map(x=>parseInt(x,16))));};
const toEscapes=s=>Array.from(s,ch=>{const cp=ch.codePointAt(0);return cp<=0xffff?'\\u'+cp.toString(16).toUpperCase().padStart(4,'0'):'\\u{'+cp.toString(16).toUpperCase()+'}';}).join('');
const fromEscapes=s=>{let out='',i=0;while(i<s.length){if(s[i]==='\\'&&s[i+1]==='u'){if(s[i+2]==='{'){const end=s.indexOf('}',i+3);if(end<0)throw Error('Unclosed Unicode escape sequence.');const hex=s.slice(i+3,end);if(!/^[0-9a-fA-F]{1,6}$/.test(hex))throw Error('Invalid Unicode code point escape.');const cp=parseInt(hex,16);if(cp>0x10ffff||(cp>=0xd800&&cp<=0xdfff))throw Error('Invalid Unicode code point.');out+=String.fromCodePoint(cp);i=end+1;continue;}const hex=s.slice(i+2,i+6);if(!/^[0-9a-fA-F]{4}$/.test(hex))throw Error('Expected four hexadecimal digits after \\u.');const cp=parseInt(hex,16);if(cp>=0xd800&&cp<=0xdbff){const next=s.slice(i+6,i+12);if(!/^\\u[0-9a-fA-F]{4}$/.test(next))throw Error('A high surrogate must be followed by a low-surrogate escape.');const low=parseInt(next.slice(2),16);if(low<0xdc00||low>0xdfff)throw Error('Invalid low-surrogate escape.');out+=String.fromCharCode(cp,low);i+=12;continue;}if(cp>=0xdc00&&cp<=0xdfff)throw Error('A low surrogate cannot appear without a preceding high surrogate.');out+=String.fromCharCode(cp);i+=6;continue;}out+=s[i++];}return out;};
const toAscii=s=>{const cps=Array.from(s);if(cps.some(ch=>ch.codePointAt(0)>127))throw Error('This ASCII converter supports basic ASCII characters only. Non-ASCII characters cannot be represented in standard ASCII.');return cps.map(ch=>ch.codePointAt(0)).join(' ');};
const fromAscii=s=>{if(!s.trim())return '';const nums=s.trim().split(/[\\s,]+/);if(nums.some(n=>!/^[0-9]{1,3}$/.test(n)||+n>127))throw Error('Enter decimal ASCII values from 0 to 127, separated by spaces.');return nums.map(n=>String.fromCharCode(Number(n))).join('');};
const invisible=/[\p{Cf}\u00AD\u034F\u115F\u1160\u17B4\u17B5\u180B-\u180E\uFE00-\uFE0F\uFEFF\uFFF9-\uFFFB]/gu;
const run=()=>{if(!input||!output)return;const v=input.value;const action=mode?.value||'encode';try{let r='';
if(tool==='preeti-to-unicode'||tool==='unicode-to-preeti'){if(!window.UnicodeFixPreeti)throw Error('Preeti conversion engine could not be loaded. Refresh and try again.');r=action==='unicode-to-preeti'?window.UnicodeFixPreeti.fromUnicode(v):window.UnicodeFixPreeti.toUnicode(v);}
else if(tool==='bamini-to-unicode'||tool==='unicode-to-bamini'){if(!window.UnicodeFixBamini)throw Error('Bamini conversion engine could not be loaded. Refresh and try again.');r=action==='unicode-to-bamini'?window.UnicodeFixBamini.fromUnicode(v):window.UnicodeFixBamini.toUnicode(v);}
else if(tool==='bijoy-to-unicode'||tool==='unicode-to-bijoy'){if(!window.UnicodeFixBijoy)throw Error('Bijoy conversion engine could not be loaded. Refresh and try again.');r=action==='unicode-to-bijoy'?window.UnicodeFixBijoy.fromUnicode(v):window.UnicodeFixBijoy.toUnicode(v);}
else if(tool==='fm-abaya-to-unicode'||tool==='unicode-to-fm-abaya'){if(!window.UnicodeFixFMAbhaya)throw Error('FM Abhaya conversion engine could not be loaded. Refresh and try again.');r=action==='unicode-to-fm-abaya'?window.UnicodeFixFMAbhaya.fromUnicode(v):window.UnicodeFixFMAbhaya.toUnicode(v);}
else if(tool==='unicode-to-non-unicode'){const encoders={preeti:()=>window.UnicodeFixPreeti?.fromUnicode(v),bamini:()=>window.UnicodeFixBamini?.fromUnicode(v),bijoy:()=>window.UnicodeFixBijoy?.fromUnicode(v),'fm-abaya':()=>window.UnicodeFixFMAbhaya?.fromUnicode(v)};const encode=encoders[action];if(!encode)throw Error('Choose a supported target font.');const result=encode();if(typeof result!=='string')throw Error('The selected conversion engine could not be loaded. Refresh and try again.');r=result;}
else if(tool==='html-encode-decode'){if(action==='decode'){const d=document.createElement('textarea');d.innerHTML=v;r=d.value;}else{r=v.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}}
else if(tool==='url-encode-decode'){r=action==='decode'?decodeURIComponent(v.replace(/\+/g,' ')):encodeURIComponent(v);}
else if(tool==='base64-encode-decode'){if(action==='decode'){const bytes=Uint8Array.from(atob(v.trim()),c=>c.charCodeAt(0));r=new TextDecoder('utf-8',{fatal:true}).decode(bytes);}else{const bytes=new TextEncoder().encode(v);let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));r=btoa(bin);}}
else if(tool==='unicode-text-converter'){r=Array.from(v).map(ch=>`${ch}  U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')}`).join('\n');}
else if(tool==='unicode-normalizer'){r=v.normalize(action);}
else if(tool==='utf8-encoder-decoder'){r=action==='decode'?fromHexBytes(v):toBytesHex(v);}
else if(tool==='remove-invisible-characters'){if(action==='report'){const matches=[...v.matchAll(invisible)];r=matches.length?matches.map(m=>`Position ${m.index}: U+${m[0].codePointAt(0).toString(16).toUpperCase().padStart(4,'0')}`).join('\n'):'No matching invisible formatting characters found.';}else{r=v.replace(invisible,'');}}
else if(tool==='text-cleaner'){r=v.split(/\r\n|\r|\n/);if(action==='trim'||action==='all')r=r.map(x=>x.trim());if(action==='spaces'||action==='all')r=r.map(x=>x.replace(/[\t ]{2,}/g,' '));if(action==='blank'||action==='all')r=r.filter((x,i,a)=>x.trim()!==''|| (i>0&&a[i-1].trim()!==''));r=r.join('\n');}
else if(tool==='unicode-escape-converter'){r=action==='decode'?fromEscapes(v):toEscapes(v);}
else if(tool==='ascii-converter'){r=action==='decode'?fromAscii(v):toAscii(v);}
else if(tool==='text-case-converter'){if(action==='upper')r=v.toLocaleUpperCase();else if(action==='lower')r=v.toLocaleLowerCase();else if(action==='toggle')r=Array.from(v,ch=>ch===ch.toLocaleUpperCase()?ch.toLocaleLowerCase():ch.toLocaleUpperCase()).join('');else if(action==='sentence')r=v.toLocaleLowerCase().replace(/(^\s*[\p{L}]|[.!?]\s+[\p{L}])/gu,m=>m.toLocaleUpperCase());else r=v.toLocaleLowerCase().replace(/(^|[\s-])([\p{L}])/gu,(m,a,b)=>a+b.toLocaleUpperCase());}
else if(tool==='word-character-counter'){const words=v.trim()?v.trim().split(/\s+/u).length:0;const chars=Array.from(v).length;const noSpaces=Array.from(v.replace(/\s/gu,'')).length;const normalizedLines=v.replace(/\r\n?/g,'\n');const lines=v?normalizedLines.split('\n').length:0;const paragraphs=v.trim()?normalizedLines.trim().split(/\n\s*\n/u).length:0;r=`Words: ${words}\nCharacters (including spaces): ${chars}\nCharacters (excluding whitespace): ${noSpaces}\nLines: ${lines}\nParagraphs: ${paragraphs}`;}
else throw Error('This tool is not available yet.');
output.value=r;count(output,$('#output-count'));if(status)status.textContent='Done. Review the result before using it.';
}catch(e){if(status)status.textContent=e.message||'Could not convert this input. Check the text and try again.';output.value='';count(output,$('#output-count'));}};
if(input&&output){input.addEventListener('input',()=>count(input,$('#input-count')));$('#convert-btn')?.addEventListener('click',run);$('#clear-btn')?.addEventListener('click',()=>{input.value='';output.value='';count(input,$('#input-count'));count(output,$('#output-count'));if(status)status.textContent='';input.focus();});$('#sample-btn')?.addEventListener('click',()=>{const legacySamples={preeti:'नेपाल भाषा',bamini:'தமிழ் ஒரு அழகான மொழி',bijoy:'আমি বাংলায় গান গাই','fm-abaya':'ශ්‍රී ලංකාව ලස්සන රටකි.'};input.value=tool==='unicode-to-non-unicode'?(legacySamples[mode?.value]||''): (samples[tool]||'Sample text');count(input,$('#input-count'));});$('#copy-btn')?.addEventListener('click',async()=>{if(!output.value)return;try{await navigator.clipboard.writeText(output.value);if(status)status.textContent='Result copied.';}catch(e){output.select();if(status)status.textContent='Select and copy the result.';}});$('#download-btn')?.addEventListener('click',()=>{if(!output.value)return;const a=document.createElement('a');const url=URL.createObjectURL(new Blob([output.value],{type:'text/plain;charset=utf-8'}));a.href=url;a.download='unicodefix-result.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});}
const search=$('#tool-search'),grid=$('#tool-grid'),filters=[...document.querySelectorAll('.filter')];let active='all';const filter=()=>{if(!grid)return;let shown=0;grid.querySelectorAll('.tool-tile').forEach(card=>{const group=card.dataset.group.toLowerCase();const categoryMatch=active==='all'||(active==='Legacy font conversion'?(group.includes('legacy')||group.includes('font')):card.dataset.group===active);const ok=categoryMatch&&(!search?.value||card.dataset.name.includes(search.value.toLowerCase()));card.hidden=!ok;if(ok)shown++;});$('#no-results').hidden=shown!==0;};search?.addEventListener('input',filter);filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));b.classList.add('active');active=b.dataset.filter;filter();}));const menu=$('.menu-toggle'),nav=$('.nav nav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('nav-open');menu.setAttribute('aria-expanded',String(open));});
})();