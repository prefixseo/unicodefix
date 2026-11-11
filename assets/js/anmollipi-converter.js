(function () {
'use strict';
/* AnmolLipi / GurmukhiAkhar legacy ASCII ↔ Unicode Gurmukhi converter.
 * Adapted from the MIT-licensed Shabad OS Gurmukhi package:
 * https://github.com/shabados/shabados/tree/main/packages/gurmukhi
 * Copyright (c) 2026 Shabad OS contributors.
 * The legacy ASCII encoding is lossy for some variant distinctions; Unicode
 * output targets the Unicode Consortium representation.
 * MIT License: permission is granted, free of charge, to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies, subject to
 * inclusion of this copyright and permission notice. Software is provided
 * "AS IS", without warranty of any kind.
 */
const U2A={"ੳ":"a","ਅ":"A","ੲ":"e","ਸ":"s","ਹ":"h","ਕ":"k","ਖ":"K","ਗ":"g","ਘ":"G","ਙ":"|","ਚ":"c","ਛ":"C","ਜ":"j","ਝ":"J","ਞ":"\\","ਟ":"t","ਠ":"T","ਡ":"f","ਢ":"F","ਣ":"x","ਤ":"q","ਥ":"Q","ਦ":"d","ਧ":"D","ਨ":"n","ਪ":"p","ਫ":"P","ਬ":"b","ਭ":"B","ਮ":"m","ਯ":"X","ਰ":"r","ਲ":"l","ਵ":"v","ੜ":"V","ਸ਼":"S","ਜ਼":"z","ਖ਼":"^","ਫ਼":"&","ਗ਼":"Z","ਲ਼":"L","਼":"æ","ੑ":"@","ੵ":"´","ਃ":"Ú","ਓ":"E","ਆ":"Aw","ਇ":"ei","ਈ":"eI","ਉ":"au","ਊ":"aU","ਏ":"ey","ਐ":"AY","ਔ":"AO","ਾ":"w","ਿ":"i","ੀ":"I","ੁ":"u","ੂ":"U","ੇ":"y","ੈ":"Y","ੋ":"o","ੌ":"O","ੰ":"M","ਂ":"N","ੱ":"~","।":"[","॥":"]","੦":"0","੧":"1","੨":"2","੩":"3","੪":"4","੫":"5","੬":"6","੭":"7","੮":"8","੯":"9","ੴ":"<>","☬":"Ç"}, A2U={"0":"੦","1":"੧","2":"੨","3":"੩","4":"੪","5":"੫","6":"੬","7":"੭","8":"੮","9":"੯","a":"ੳ","b":"ਬ","c":"ਚ","d":"ਦ","e":"ੲ","f":"ਡ","g":"ਗ","h":"ਹ","i":"ਿ","j":"ਜ","k":"ਕ","l":"ਲ","m":"ਮ","n":"ਨ","o":"ੋ","p":"ਪ","q":"ਤ","r":"ਰ","s":"ਸ","t":"ਟ","u":"ੁ","v":"ਵ","w":"ਾ","x":"ਣ","y":"ੇ","z":"ਜ਼","A":"ਅ","B":"ਭ","C":"ਛ","D":"ਧ","E":"ਓ","F":"ਢ","G":"ਘ","H":"੍ਹ","I":"ੀ","J":"ਝ","K":"ਖ","L":"ਲ਼","M":"ੰ","N":"ਂ","O":"ੌ","P":"ਫ","Q":"ਥ","R":"੍ਰ","S":"ਸ਼","T":"ਠ","U":"ੂ","V":"ੜ","W":"ਾਂ","X":"ਯ","Y":"ੈ","Z":"ਗ਼","[":"।","]":"॥","\\":"ਞ","|":"ਙ","`":"ੱ","~":"ੱ","@":"ੑ","^":"ਖ਼","&":"ਫ਼","†":"੍ਟ","ü":"ੁ","®":"੍ਰ","´":"ੵ","¨":"ੂ","µ":"ੰ","æ":"਼","¡":"ੴ","ƒ":"ਨੂੰ","œ":"੍ਤ","Í":"੍ਵ","Ï":"ੵ","Ò":"॥","Ú":"ਃ","ˆ":"ਂ","˜":"੍ਨ","§":"੍ਹੂ","¤":"ੱ","ç":"੍ਚ","Ç":"☬","‚":"❁","Æ":"","Ø":"","ÿ":"","s stamp\n        ":"","‰":"","Ó":"","Ô":"","Î":"︀ਯ","ï":"︁ਯ","î":"︀︁ਯ"};
const UREPL=[["︀︁ਯ","î"],["︀ਯ","Î"],["︁ਯ","ï"],["੍ਯ","Î"],["ਂ‍ੀ","ˆØI"],["੍ਰ","R"],["੍ਵ","Í"],["੍ਹ","H"],["੍ਚ","ç"],["੍ਟ","†"],["੍ਤ","œ"],["੍ਨ","˜"]], AREPL=[["ˆØI","ਂ‍ੀ"],["<>","ੴ"],["<","ੴ"],[">","☬"],["Åå","ੴ"],["Å","ੴ"],["å","ੴ"]], COMBOS=[["IM","µØI"],["Iµ","µØI"],["kR","k®"],["H¨","§"],["wN","W"],["wˆ","W"],["nUµ","ƒ"]];
const VS_TO_U=[['︀︁ਯ','੍ਯ'],['︀ਯ','੍ਯ'],['︁ਯ','ਯ'],['ਂ‍ੀ','ੀਂ']];
const BASE='AeshkKgG|cCjJ\\\\tTfFxqQdDnpPbBmXrlvVSz^&ZLÎïî';
const MOD='æ@´ÚwIuUyYoO`MNRÍHç†œ˜ü¨®µˆW~¤Ï', BELOW='RÍHç†œ˜´@', NON_ABOVE='æ@´ÚwuURÍHç†œ˜ü¨®Ï';
const MARKS=new Set([...'਼ੑੵਿੇੈੋੌੁੂਾੀਁੱਂੰਃ‌‍']), BELOW_LETTERS=new Set([...'ਹਰਵਟਤਨਚ']);
const ORDER='਼ੑੵ੍ਹਰਵਟਤਨਚਿੇੈੋੌੁੂਾੀਁੱਂੰਃ';
const SANIT=[['ੳੋ','ਓ'],['ਅਾ','ਆ'],['ੲਿ','ਇ'],['ੲੀ','ਈ'],['ੳੁ','ਉ'],['ੳੂ','ਊ'],['ੲੇ','ਏ'],['ਅੈ','ਐ'],['ਅੌ','ਔ'],['ਲ਼','ਲ਼'],['ਸ਼','ਸ਼'],['ਖ਼','ਖ਼'],['ਗ਼','ਗ਼'],['ਜ਼','ਜ਼'],['ਫ਼','ਫ਼'],['ੱਂ','ਁ']];
function replace(s,pairs){for(const [a,b] of pairs)s=s.split(a).join(b);return s;}
function normalizeUnicode(input){
 let out='',i=0;const order=new Map([...ORDER].map((c,i)=>[c,i]));
 while(i<input.length){
  const ch=String.fromCodePoint(input.codePointAt(i));out+=ch;i+=ch.length;
  if(ch.codePointAt(0)<0x0a00||ch.codePointAt(0)>0x0a7f)continue;
  let marks='';
  while(i<input.length){
   const next=String.fromCodePoint(input.codePointAt(i));
   if(MARKS.has(next)){marks+=next;i+=next.length;continue;}
   if(next==='੍'&&i+1<input.length){const after=String.fromCodePoint(input.codePointAt(i+1));if(BELOW_LETTERS.has(after)){marks+='੍'+after;i+=1+after.length;continue;}}
   break;
  }
  let bindi=false;if(marks.includes('ਂ‍ੀ')){marks=marks.split('ਂ‍ੀ').join('');bindi=true;}
  marks=[...marks].sort((x,y)=>(order.get(x)??999)-(order.get(y)??999)).join('');
  if(bindi)marks+='ਂ‍ੀ';out+=marks;
 }
 out=replace(out,SANIT);
 out=out.replace(/([︀︁︂︃︄︅︆︇︈︉︊︋︌︍]*)([\\u0A00-\\u0A7F])/gu,(_,vs,ch)=>[...vs].sort((x,y)=>x.codePointAt(0)-y.codePointAt(0)).join('')+ch);
 return out;
}
function charClass(s){return [...s].map(c=>/[\\\\\\]^\\-]/.test(c)?'\\\\'+c:c).join('');}
function toUnicode(input){
 let s=input.replaceAll('੍ਯ','︀ਯ');
 s=s.replace(/i([A-Za-z|^&Îîï])/g,'$1i');
 s=replace(s,AREPL);
 s=[...s].map(c=>A2U[c]??c).join('');
 s=normalizeUnicode(s);
 return replace(s,VS_TO_U);
}
function fromUnicode(input){
 let s=normalizeUnicode(input);
 s=replace(s,UREPL);
 s=[...s].map(c=>U2A[c]??c).join('');
 s=s.replace(new RegExp('(['+charClass(BASE)+']['+charClass(MOD)+' ]*)i(['+charClass(MOD)+']*)','g'),'i$1$2');
 s=s.replace(new RegExp('(['+charClass(BELOW)+']['+charClass(MOD)+' ]*)u(['+charClass(MOD)+']*)','g'),'$1ü$2');
 s=s.replace(new RegExp('(['+charClass(BELOW)+']['+charClass(MOD)+' ]*)U(['+charClass(MOD)+' ]*)','g'),'$1¨$2');
 s=s.replace(new RegExp('([nT]['+charClass(MOD)+' ]*)M(['+charClass(MOD)+' ]*)','g'),'$1µ$2');
 s=s.replace(new RegExp('(['+charClass(BASE)+']['+charClass(NON_ABOVE)+' ]*)N(['+charClass(NON_ABOVE)+' ]*)','g'),'$1ˆ$2');
 s=s.replace(new RegExp('(['+charClass(BASE)+']['+charClass(NON_ABOVE)+' ]*)~(['+charClass(NON_ABOVE)+' ]*)','g'),'$1`$2');
 return replace(s,COMBOS);
}
window.UnicodeFixAnmolLipi=Object.freeze({toUnicode,fromUnicode});
})();
