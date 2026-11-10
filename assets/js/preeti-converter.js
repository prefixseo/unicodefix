/*
 * UnicodeFix Preeti ↔ Unicode engine.
 * Character mappings and ordering rules adapted from:
 * - preeti2unicode v1.0.7, Roj Tamang and Navraj Bhattarai (MIT License)
 * - unicode-to-preeti v1.0.0, Milkesh Shrestha (ISC License)
 * The upstream source and notices are documented in THIRD-PARTY-NOTICES.txt.
 * This file is distributed with the applicable copyright and license notices.
 */
(function (global) {
  'use strict';
  const VIRAMA = '्';
  const C = '[\\u0915-\\u0939\\u0958-\\u095F\\u0978-\\u097F]';
  const NUKTA = '़';
  const CN = C + NUKTA + '?';
  const CLUSTER = '(?:' + CN + VIRAMA + ')*' + CN;
  const MARKS = '[\\u0900-\\u0903\\u093A\\u093B\\u093E-\\u094C\\u094E\\u094F\\u0955-\\u0957\\u0962\\u0963]';
  const VOWEL_SIGNS = '[\\u093E-\\u094C\\u0901-\\u0903]';
  const preetiMap = {
    a:'ब',b:'द',c:'अ',d:'म',e:'भ',f:'ा',g:'न',h:'ज',i:'ष्',j:'व',k:'प',l:'ि',n:'ल',o:'य',p:'उ',q:'त्र',r:'च',s:'क',t:'त',u:'ग',v:'ख',w:'ध',x:'ह',y:'थ',z:'श',
    A:'ब्',B:'द्य',C:'ऋ',D:'म्',E:'भ्',F:'ँ',G:'न्',H:'ज्',I:'क्ष्',J:'व्',K:'प्',L:'ी',M:'ः',N:'ल्',O:'इ',P:'ए',Q:'त्त',R:'च्',S:'क्',T:'त्',U:'ग्',V:'ख्',W:'ध्',X:'ह्',Y:'थ्',Z:'श्',
    '0':'ण्','1':'ज्ञ','2':'द्द','3':'घ','4':'द्ध','5':'छ','6':'ट','7':'ठ','8':'ड','9':'ढ',')':'०','!':'१','@':'२','#':'३','$':'४','%':'५','^':'६','&':'७','*':'८','(':'९',
    '[':'ृ',']':'े','{':'{','}':'ै','\\':'्','|':'्र',';':'स',':':'स्',"'":'ु','"':'ू',',':',','.':'।','/':'र','<':'?','>':'श्र','?':'रु','=':'.','+':'ं','-':'(','_':')','`':'ञ','~':'ञ्',
    '¿':'रू','§':'ट्ट','£':'घ्','•':'ड्ड','«':'्र','„':'ध्र','ˆ':'फ्','Î':'ङ्ख','¶':'ठ्ठ','¢':'द्घ','ª':'ङ','Ý':'ट्ठ','Å':'हृ','Í':'ङ्क','¥':'र्‍','¡':'ज्ञ्','©':'र','‘':'ॅ','˜':'ऽ','Ø':'्य','Ì':'न्न','´':'झ','°':'ङ्ढ','‹':'ङ्घ','¤':'झ्','‰':'झ्','›':'द्र','å':'द्व','ß':'द्म','Ë':'ङ्ग','ç':'ॐ','Þ':'़','÷':'/','×':'×','±':'+','Ö':'=','Û':'!','Ü':'%','Ù':';','Ú':'’','…':'‘','æ':'“','Æ':'”'
  };
  const mJoin = {'त्र':'क्र','त्त':'क्त','उ':'ऊ','भ':'झ','प':'फ'};
  function replaceAll(s,a,b){return s.split(a).join(b);}
  function toUnicode(input){
    if(!input)return '';
    let text='';
    for(const ch of input.replace(/\r\n?/g,'\n')) text += Object.prototype.hasOwnProperty.call(preetiMap,ch)?preetiMap[ch]:ch;
    text=replaceAll(text,VIRAMA+'ा','');
    const reM=new RegExp('(त्र|त्त|उ|भ|प)((?:्र)?)('+VOWEL_SIGNS+'*)m','g');
    text=text.replace(reM,(_,base,ra,signs)=>mJoin[base]+ra+signs);
    text=replaceAll(text,'इ{','ई');
    text=text.replace(new RegExp('ि('+CLUSTER+')','g'),'$1ि');
    text=text.replace(new RegExp('('+CLUSTER+MARKS+'*)\\{','g'),'र्$1');
    text=replaceAll(text,'{','र्');
    text=text.replace(/([ंँ])([ािीुूृेैोौः]+)/g,'$2$1');
    const cleanups=[['ँँ','ँ'],['ंं','ं'],['ेे','े'],['ैै','ै'],['ुु','ु'],['ूू','ू'],['टृ','ट्ट'],['ेा','ाे'],['ैा','ाै'],['अाे','ओ'],['अाै','औ'],['अा','आ'],['एे','ऐ'],['ाे','ो'],['ाै','ौ']];
    for(const [a,b] of cleanups) text=replaceAll(text,a,b);
    text=text.replace(/ः/g,(m,offset,whole)=>offset>0&&/[ऀ-ॏॕ-ॣ]/.test(whole[offset-1])?m:':');
    return text.normalize('NFC');
  }
  const P_I='\uE000', P_REPH='\uE001', P_EYELASH='\uE002';
  const consonants={'क':'s','ख':'v','ग':'u','घ':'3','ङ':'ª','च':'r','छ':'5','ज':'h','झ':'´','ञ':'`','ट':'6','ठ':'7','ड':'8','ढ':'9','ण':'0f','त':'t','थ':'y','द':'b','ध':'w','न':'g','प':'k','फ':'km','ब':'a','भ':'e','म':'d','य':'o','र':'/','ल':'n','व':'j','श':'z','ष':'if','स':';','ह':'x'};
  const round=new Set(['ट','ठ','ड','ढ','छ']);
  const unicodeMap={
    [P_I]:'l',[P_REPH]:'{',
    'अ':'c','आ':'cf','इ':'O','ई':'O{','उ':'p','ऊ':'pm','ऋ':'C','ए':'P','ऐ':'P]','ओ':'cf]','औ':'cf}','ऑ':'cf‘','ॐ':'ç',
    ...consonants,
    'क्':'S','ख्':'V','ग्':'U','घ्':'£','च्':'R','ज्':'H','झ्':'‰','ञ्':'~','ण्':'0','त्':'T','थ्':'Y','ध्':'W','न्':'G','प्':'K','फ्':'ˆ','ब्':'A','भ्':'E','म्':'D','ल्':'N','व्':'J','श्':'Z','ष्':'i','स्':':','ह्':'X',
    'क्ष':'If','क्ष्':'I','त्र':'q','ज्ञ':'1','ज्ञ्':'¡','श्र':'>','द्द':'2','द्ध':'4','द्य':'B','द्व':'å','द्म':'ß','द्घ':'¢','द्र':'›','ध्र':'„','ट्ट':'§','ट्ठ':'Ý','ड्ड':'•','ठ्ठ':'¶','त्त':'Q','क्त':'Qm','क्र':'qm','फ्र':'k|m','न्न':'Ì','ङ्क':'Í','ङ्ख':'Î','ङ्ग':'Ë','ङ्घ':'‹','हृ':'Å','रु':'?','रू':'¿','ट्र':'6«','ठ्र':'7«','ड्र':'8«','ढ्र':'9«','्र':'|','्य':'Ø',
    'ा':'f','ी':'L','ु':"'",'ू':'"','ृ':'[','े':']','ै':'}','ो':'f]','ौ':'f}','ॉ':'f‘','ॅ':'‘','ं':'+','ँ':'F','ः':'M','्':'\\','़':'Þ','ऽ':'˜',
    '०':')','१':'!','२':'@','३':'#','४':'$','५':'%','६':'^','७':'&','८':'*','९':'(','0':')','1':'!','2':'@','3':'#','4':'$','5':'%','6':'^','7':'&','8':'*','9':'(',
    '।':'.','॥':'..','.':'=',',':',','?':'<','/':'÷','(':'-',')':'_',';':'Ù',':':'M','!':'Û','%':'Ü','=':'Ö','+':'±','‘':'…','’':'Ú','“':'æ','”':'Æ',"'":'Ú','"':'Æ','-':'–'
  };
  for(const [c,key] of Object.entries(consonants)){const half=c+VIRAMA+'र';if(!unicodeMap[half])unicodeMap[half]=key+(round.has(c)?'«':'|');}
  unicodeMap[P_EYELASH]='¥';
  const maxKey=Math.max(...Object.keys(unicodeMap).map(k=>k.length));
  function reorder(text){const re=new RegExp('(र्(?='+CN+'))?('+CLUSTER+')('+MARKS+'*)','g');return text.replace(re,(_,reph,cluster,marks)=>{const hasI=marks.includes('ि');let signs=hasI?marks.replace('ि',''):marks;const nasal=signs.replace(/[^ंँ]/g,'');signs=signs.replace(/[ंँ]/g,'');return (hasI?P_I:'')+cluster+signs+(reph?P_REPH:'')+nasal;});}
  function fromUnicode(input){
    if(!input)return '';
    let text=input.normalize('NFC').replace(/\r\n?/g,'\n').replace(/[\u200B\u200C\uFEFF]/g,'');
    text=text.replace(/र्‍/g,P_EYELASH).replace(/‍/g,'');
    text=reorder(text);
    let out='',i=0;
    while(i<text.length){let found=false;for(let len=Math.min(maxKey,text.length-i);len>0;len--){const key=text.slice(i,i+len);if(Object.prototype.hasOwnProperty.call(unicodeMap,key)){out+=unicodeMap[key];i+=len;found=true;break;}}if(!found){out+=text[i];i++;}}
    return out;
  }
  global.UnicodeFixPreeti={toUnicode,fromUnicode};
})(window);
