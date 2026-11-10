/* Bamini Tamil legacy font converter.
 * Mapping adapted from aril by Sanjaiyan Parthipan.
 * Source: https://github.com/digital-tamil/aril
 * License: MIT (see THIRD-PARTY-NOTICES.txt).
 */
const PULLI = '்';

/** Bamini glyph -> consonant. */
const CONSONANT = {
  f: 'க', q: 'ங', r: 'ச', '[': 'ஜ', Q: 'ஞ', l: 'ட', z: 'ண', j: 'த', e: 'ந', d: 'ன',
  g: 'ப', k: 'ம', a: 'ய', u: 'ர', y: 'ல', s: 'ள', t: 'வ', o: 'ழ', w: 'ற', '`': 'ஹ',
  '\\': 'ஷ', ']': 'ஸ',
};

/** Single glyphs that already carry ு (u) or ூ (uu), or ி / ீ for ட. */
const LIGATURE = {
  F: 'கு', R: 'சு', L: 'டு', Z: 'ணு', J: 'து', E: 'நு', D: 'னு', G: 'பு', K: 'மு',
  A: 'யு', U: 'ரு', Y: 'லு', S: 'ளு', O: 'ழு', W: 'று', T: 'வு',
  $: 'கூ', '#': 'சூ', '^': 'டூ', '%': 'மூ', '&': 'ரூ', '*': 'ழூ',
  b: 'டி', B: 'டீ',
};

/** Signs typed after the consonant. */
const POST_SIGN = {
  h: 'ா', p: 'ி', P: 'ீ', ';': PULLI, '{': 'ு', _: 'ூ', '+': 'ூ',
};

/** Signs typed before the consonant. */
const PRE_SIGN = { n: 'ெ', N: 'ே', i: 'ை' };

/** Independent vowels and other single glyphs. */
const OTHER = {
  m: 'அ', M: 'ஆ', ',': 'இ', '<': 'ஈ', c: 'உ', C: 'ஊ', v: 'எ', V: 'ஏ', I: 'ஐ', x: 'ஒ',
  X: 'ஓ', '/': 'ஃ', '=': 'ஸ்ரீ', H: 'ர்', '>': ',', '@': ';', '–': '-',
};

// ---------------------------------------------------------------------------
// Bamini -> Unicode
// ---------------------------------------------------------------------------

/** Read a consonant (or ligature, or க்ஷ) at position i. */
function readBase(s, i) {
  const c = s[i];
  // க்ஷ is typed f;\ and takes vowel signs as one unit.
  if (c === 'f' && s[i + 1] === ';' && s[i + 2] === '\\') return { text: 'க்ஷ', bare: true, end: i + 3 };
  // h before p / P / ; is the old-style ர glyph (hp = ரி).
  if (c === 'h' && (s[i + 1] === 'p' || s[i + 1] === 'P' || s[i + 1] === ';')) {
    return { text: 'ர', bare: true, end: i + 1 };
  }
  if (c in CONSONANT) return { text: CONSONANT[c], bare: true, end: i + 1 };
  if (c in LIGATURE) return { text: LIGATURE[c], bare: false, end: i + 1 };
  return null;
}

/** Convert Bamini-encoded text to Unicode Tamil (NFC). */
function toUnicode(s) {
  if (!s) return '';
  let out = '';
  let i = 0;
  while (i < s.length) {
    const c = s[i];

    // ெ ே ை typed before the consonant; ொ ோ ௌ are split around it.
    if (c in PRE_SIGN) {
      const base = readBase(s, i + 1);
      if (base && base.bare) {
        let k = base.end;
        let sign = PRE_SIGN[c];
        if (c === 'n' && s[k] === 'h') { sign = 'ொ'; k++; }
        else if (c === 'N' && s[k] === 'h') { sign = 'ோ'; k++; }
        else if (c === 'n' && s[k] === 's' && !(s[k + 1] in POST_SIGN)) {
          // n C s is ௌ, unless that s is ள carrying its own sign (வெள்ளம் = nts;sk;)
          sign = 'ௌ';
          k++;
        }
        out += base.text + sign;
        i = k;
        continue;
      }
      out += PRE_SIGN[c];
      i++;
      continue;
    }

    // ஔ = x + ள-shaped au length mark
    if (c === 'x' && s[i + 1] === 's') {
      out += 'ஔ';
      i += 2;
      continue;
    }

    const base = readBase(s, i);
    if (base) {
      let k = base.end;
      let text = base.text;
      const next = s[k];
      if (base.bare) {
        const rIsNext = next === 'h' && 'pP;'.includes(s[k + 1] ?? ' '); // hp = ரி
        if (next !== undefined && next in POST_SIGN && !rIsNext) {
          text += POST_SIGN[next];
          k++;
        } else if (text === 'ஞ' && next === 'c') {
          // ஞு / ஞூ are typed Q + c (+ })
          text += s[k + 1] === '}' ? 'ூ' : 'ு';
          k += s[k + 1] === '}' ? 2 : 1;
        }
      } else if (text.endsWith('ு') && (next === 'h' || next === '}' || next === '+')) {
        // u ligature + hook = uu (Jh = தூ, G+ = பூ)
        text = text.slice(0, -1) + 'ூ';
        k++;
      }
      out += text;
      i = k;
      continue;
    }

    if (c === 'h') out += 'ா';
    else if (c === 'p') out += 'ி';
    else if (c === 'P') out += 'ீ';
    else if (c in OTHER) out += OTHER[c];
    else out += c;
    i++;
  }
  return out.normalize('NFC');
}

// ---------------------------------------------------------------------------
// Unicode -> Bamini
// ---------------------------------------------------------------------------

const CONSONANT_GLYPH = Object.fromEntries(
  Object.entries(CONSONANT).map(([k, v]) => [v, k]),
);
const LIGATURE_GLYPH = Object.fromEntries(
  Object.entries(LIGATURE).map(([k, v]) => [v, k]),
);
const OTHER_GLYPH = {
  அ: 'm', ஆ: 'M', இ: ',', ஈ: '<', உ: 'c', ஊ: 'C', எ: 'v', ஏ: 'V', ஐ: 'I', ஒ: 'x',
  ஓ: 'X', ஔ: 'xs', ஃ: '/', ',': '>', ';': '@',
};

/** Consonants whose ூ is written as the ு ligature plus a hook. */
const UU_HOOK = {
  ண: 'h', த: 'h', ந: 'h', ன: 'h', ல: 'h', ற: 'h', ள: 'h', க: 'h', ச: 'h', ம: 'h',
  ர: 'h', ழ: 'h', ப: '+', ய: '+', வ: '+',
};

const SIGN_GLYPH = { 'ா': 'h', 'ி': 'p', 'ீ': 'P', [PULLI]: ';' };

const isTamilConsonant = (c) => c !== undefined && c in CONSONANT_GLYPH;

/** Convert Unicode Tamil to Bamini-encoded text. */
function fromUnicode(s) {
  if (!s) return '';
  const a = s.normalize('NFC').replace(/ஸ்ரீ/g, '=').split('');
  let out = '';
  let i = 0;
  while (i < a.length) {
    const c = a[i];
    if (!isTamilConsonant(c)) {
      out += OTHER_GLYPH[c] ?? c;
      i++;
      continue;
    }

    // Base: a consonant, or க்ஷ as one unit.
    let base = c;
    let glyph = CONSONANT_GLYPH[c];
    let k = i + 1;
    if (c === 'க' && a[k] === PULLI && a[k + 1] === 'ஷ') {
      base = 'க்ஷ';
      glyph = 'f;\\';
      k += 2;
    }
    const v = a[k];

    if (v === 'ெ' || v === 'ே' || v === 'ை') {
      out += { 'ெ': 'n', 'ே': 'N', 'ை': 'i' }[v] + glyph;
      k++;
    } else if (v === 'ொ' || v === 'ோ' || v === 'ௌ') {
      out += (v === 'ோ' ? 'N' : 'n') + glyph + (v === 'ௌ' ? 's' : 'h');
      k++;
    } else if (v === 'ு' || v === 'ூ') {
      const lig = LIGATURE_GLYPH[base + v];
      if (lig) out += lig;
      else if (v === 'ூ' && LIGATURE_GLYPH[base + 'ு'] && UU_HOOK[base]) {
        out += LIGATURE_GLYPH[base + 'ு'] + UU_HOOK[base];
      } else if (base === 'ஞ') out += v === 'ு' ? 'Qc' : 'Qc}';
      else out += glyph + (v === 'ு' ? '{' : '_'); // grantha letters, ங
      k++;
    } else if (v === 'ி' || v === 'ீ') {
      out += LIGATURE_GLYPH[base + v] ?? glyph + SIGN_GLYPH[v]; // டி = b, டீ = B
      k++;
    } else if (v !== undefined && v in SIGN_GLYPH) {
      out += glyph + SIGN_GLYPH[v];
      k++;
    } else {
      out += glyph;
    }
    i = k;
  }
  return out;
}

window.UnicodeFixBamini = Object.freeze({toUnicode, fromUnicode});
