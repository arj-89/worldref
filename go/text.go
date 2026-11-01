package worldref

import (
	"strings"
	"unicode"
)

var letterMap = map[rune]rune{'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا', 'ة': 'ه', 'ى': 'ي', 'ؤ': 'و', 'ئ': 'ي'}

// WesternDigits converts Arabic-Indic and Persian digits to 0-9. Nothing else changes.
func WesternDigits(text string) string {
	return strings.Map(func(r rune) rune {
		if (r >= 0x0660 && r <= 0x0669) || (r >= 0x06F0 && r <= 0x06F9) {
			return '0' + r&0xf
		}
		return r
	}, text)
}

// nfd appends the canonical decomposition of r (Hangul included) to dst.
func nfd(dst []rune, r rune) []rune {
	const sBase, lBase, vBase, tBase, tCount, nCount = 0xAC00, 0x1100, 0x1161, 0x11A7, 28, 588
	if r >= sBase && r < sBase+19*nCount {
		s := r - sBase
		dst = append(dst, lBase+s/nCount, vBase+(s%nCount)/tCount)
		if t := s % tCount; t != 0 {
			dst = append(dst, tBase+t)
		}
		return dst
	}
	if d, ok := nfdTable[r]; ok {
		return append(dst, []rune(d)...)
	}
	return append(dst, r)
}

// Normalize folds a name or a query for matching: case, accents, Arabic letter
// variants, tashkeel, tatweel, the "al" prefix and punctuation.
func Normalize(text string) string {
	var b strings.Builder
	var buf []rune
	space := false
	for _, r := range WesternDigits(text) {
		buf = nfd(buf[:0], r)
		for _, d := range buf {
			if d >= 0x0300 && d <= 0x036F {
				continue
			}
			d = unicode.ToLower(d)
			if (d >= 0x064B && d <= 0x065F) || d == 0x0670 || d == 0x0640 {
				continue
			}
			if m, ok := letterMap[d]; ok {
				d = m
			}
			if unicode.IsLetter(d) || unicode.IsNumber(d) {
				if space && b.Len() > 0 {
					b.WriteByte(' ')
				}
				space = false
				b.WriteRune(d)
			} else {
				space = true
			}
		}
	}
	words := strings.Split(b.String(), " ")
	for i, w := range words {
		if strings.HasPrefix(w, "ال") && len([]rune(w)) > 3 {
			words[i] = w[len("ال"):]
		}
	}
	return strings.Join(words, " ")
}
