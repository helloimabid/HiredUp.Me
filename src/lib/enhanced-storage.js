function truncateAtWord(text, maxChars) {
  if (typeof text !== "string") return "";
  if (text.length <= maxChars) return text;

  const hardCut = Math.max(0, maxChars - 1);
  const slice = text.slice(0, hardCut);
  const minIndex = Math.floor(hardCut * 0.8);
  const lastSpace = slice.lastIndexOf(" ");

  if (lastSpace > minIndex) {
    return slice.slice(0, lastSpace).trimEnd() + "…";
  }

  return slice.trimEnd() + "…";
}

function deepCloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function shrinkEnhanced(enhanced, pass) {
  const copy = deepCloneJson(enhanced);

  // SEO is non-critical and can be big.
  if (copy.seo && pass >= 1) {
    delete copy.seo.keywords;
  }

  // Highlights/quick_info can grow; cap them.
  if (Array.isArray(copy.highlights)) {
    const max = pass === 0 ? 6 : pass === 1 ? 5 : 4;
    copy.highlights = copy.highlights
      .slice(0, max)
      .map((x) => (typeof x === "string" ? truncateAtWord(x, 140) : x))
      .filter(Boolean);
  }

  if (Array.isArray(copy.quick_info)) {
    const max = pass === 0 ? 8 : pass === 1 ? 6 : 5;
    copy.quick_info = copy.quick_info.slice(0, max).map((item) => {
      if (!item || typeof item !== "object") return item;
      return {
        ...item,
        label:
          typeof item.label === "string"
            ? truncateAtWord(item.label, 40)
            : item.label,
        value:
          typeof item.value === "string"
            ? truncateAtWord(item.value, 80)
            : item.value,
      };
    });
  }

  // Sections are the main contributor to size.
  if (Array.isArray(copy.sections)) {
    const maxParagraph =
      pass === 0 ? 2800 : pass === 1 ? 1600 : pass === 2 ? 1000 : 700;
    const maxItems = pass === 0 ? 10 : pass === 1 ? 8 : pass === 2 ? 6 : 4;
    const maxItemLen =
      pass === 0 ? 220 : pass === 1 ? 170 : pass === 2 ? 130 : 95;

    copy.sections = copy.sections.map((section) => {
      if (!section || typeof section !== "object") return section;
      const next = { ...section };

      if (typeof next.content === "string") {
        next.content = truncateAtWord(next.content, maxParagraph);
      }

      if (Array.isArray(next.items)) {
        next.items = next.items
          .slice(0, maxItems)
          .map((item) =>
            typeof item === "string" ? truncateAtWord(item, maxItemLen) : item,
          )
          .filter(Boolean);
      }

      return next;
    });

    // Last-resort: keep the section structure but drop large bodies.
    if (pass >= 3) {
      copy.sections = copy.sections.map((s) => ({
        id: s?.id,
        title: s?.title,
        type: s?.type,
      }));
    }
  }

  // Trim obvious long strings if present.
  if (copy.seo && typeof copy.seo.meta_description === "string") {
    copy.seo.meta_description = truncateAtWord(
      copy.seo.meta_description,
      pass === 0 ? 300 : 220,
    );
  }
  if (copy.seo && typeof copy.seo.meta_title === "string") {
    copy.seo.meta_title = truncateAtWord(copy.seo.meta_title, 120);
  }

  return copy;
}

/**
 * Stringify `enhanced` for Appwrite storage without producing invalid JSON.
 *
 * Important: NEVER `substring()` the JSON output, because that can corrupt JSON
 * and make the frontend fall back to `needsAI: true`.
 */
export function stringifyEnhancedForStorage(enhanced, maxLen = 50000) {
  if (!enhanced || typeof enhanced !== "object") {
    return JSON.stringify({ needsAI: true, aiEnhanced: false });
  }

  let candidate = enhanced;
  for (let pass = 0; pass < 5; pass++) {
    const json = JSON.stringify(candidate);
    if (json.length <= maxLen) {
      return json;
    }
    candidate = shrinkEnhanced(candidate, pass);
  }

  // Guaranteed small fallback.
  const minimal = {
    header: enhanced.header,
    apply_info: enhanced.apply_info,
    aiEnhanced: Boolean(enhanced.aiEnhanced),
    aiEnhancedAt: enhanced.aiEnhancedAt,
    needsAI: Boolean(enhanced.needsAI),
  };

  const minimalJson = JSON.stringify(minimal);
  if (minimalJson.length <= maxLen) return minimalJson;

  // Ultra fallback: flags only.
  return JSON.stringify({
    aiEnhanced: Boolean(enhanced.aiEnhanced),
    needsAI: Boolean(enhanced.needsAI),
  });
}
