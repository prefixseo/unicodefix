UNICODEFIX - CPANEL WEBSITE PACKAGE

STACK
- PHP 8.0+ recommended (tested with PHP 8.4 CLI)
- Apache with mod_rewrite enabled
- HTTPS certificate required
- No database required
- No external fonts, libraries or third-party scripts by default

INSTALLATION
1. In cPanel, point unicodefix.com to this hosting account and wait for DNS propagation.
2. Enable an SSL certificate for unicodefix.com (and www if you plan to redirect it).
3. Upload the CONTENTS of this folder into public_html (not the enclosing folder).
4. Ensure .htaccess is uploaded and Apache mod_rewrite is enabled.
5. The canonical hostname is https://unicodefix.com/ (non-www). www redirects to it.
6. Replace hello@unicodefix.com with a monitored mailbox after creating it.
7. Test HTTPS, redirects, every route, mobile layout and all tool outputs.

SCRIPT LOADING
- The small core tools.js file is deferred and loads with the page so visible tools work immediately.
- optional-loader.js is a tiny deferred loader. It imports optional-integrations.js on the first user interaction (pointer, keyboard, touch or scroll), or during idle time.
- No analytics or advertising provider is loaded until a consent-aware integration is configured.
- Do NOT delay the actual converter engine behind a scroll or click: visitors expect the tool to work immediately.

CURRENT FUNCTIONAL TOOLS
- Unicode character/code-point inspector
- Unicode Normalizer (NFC, NFD, NFKC, NFKD)
- UTF-8 hexadecimal encoder/decoder
- Invisible formatting character inspector/remover
- Text cleaner (whitespace and line endings)
- Unicode escape encoder/decoder
- ASCII decimal encoder/decoder
- Unicode-aware text case converter
- Word, character, line and paragraph counter
- HTML entity encoder/decoder
- URL component encoder/decoder
- UTF-8-safe Base64 encoder/decoder
- Preeti <-> Unicode converter (Nepali)

LEGACY CONVERTER STATUS
Legacy font pages are intentionally noindex until verified mappings are implemented. Do not submit these URLs for indexing or advertise them as working converters until each font/version mapping has been tested with reliable samples. Font conversion can require script-specific reordering, ligatures, conjuncts and shaping rules; simple character substitution is not sufficient.

BEFORE ADSENSE
- Finish and test the legacy conversion engines or keep unfinished tools out of the public sitemap/navigation.
- Replace the contact email with a working monitored mailbox.
- Adapt privacy, terms and disclaimer to the actual analytics, cookies, ads and data processing used.
- Publish original instructions, examples, limitations and troubleshooting for each finished tool.
- Add ad code only after substantial finished functionality and a quality review.

SEO
- Sitemap currently includes only launch-ready tools and information pages.
- Mapping-required tool pages are noindex,follow.
- Canonical host: https://unicodefix.com/


MODULE 2 UPDATE
This release adds eight browser-based utilities: Unicode Normalizer, UTF-8 Encoder & Decoder, Remove Invisible Characters, Text Cleaner, Unicode Escape Converter, ASCII Converter, Text Case Converter, and Word & Character Counter.

Before replacing the live files, keep a backup of your current public_html directory. Upload and extract this package over the existing installation, preserving any hosting-specific files not included here. Then test each tool with ordinary text, multilingual text, emoji, empty input, malformed input, copy and download.

The new pages are marked indexable and included in sitemap.xml because their tools are implemented. Submit the updated sitemap in Search Console after confirming the pages load correctly on the live domain.


MODULE 3 – PREETI CONVERSION
- Preeti to Unicode and Unicode to Preeti are now enabled.
- Both directions are available from either Nepali converter page.
- Conversion runs locally in the visitor's browser.
- Preeti is not interchangeable with Kantipur, Sagarmatha or other legacy fonts.
- Review complex conjuncts, mixed English text and punctuation before using output.
- See THIRD-PARTY-NOTICES.txt for mapping-source attribution and license information.
