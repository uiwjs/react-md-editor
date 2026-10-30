const FENCE_OPEN = /^```/;
const FENCE_CLOSE = /^```\r?\n?$/;
const BLANK_LINE = /^[ \t]*\r?\n?$/;
const FRONT_MATTER_FENCE = /^---\r?\n?$/;

/**
 * Splits markdown into blocks that Prism's markdown grammar highlights the same way
 * on their own as it does in the full document, so unchanged blocks can be cached.
 * Joining the returned blocks always yields the original string.
 *
 * A block ends where a run of blank lines starts, so each block keeps its leading blank
 * lines (indented code needs them). No split happens inside a ``` fence, front matter or
 * multiline markup or link references, or right before a `---` line, which Prism
 * would read as front matter. Whitespace-only lines stay in their block because
 * Prism's inline emphasis can span them.
 * Fences follow Prism's rule, not CommonMark's, so the split matches what Prism sees.
 */
export function splitBlocks(markdown: string): string[] {
  const lines: string[] = markdown.match(/[^\n]*\n|[^\n]+$/g) || [];
  const blocks: string[] = [];
  let current = '';
  let pendingSplit = -1;
  let inFence = false;
  let inFrontMatter = /^(?:\s*[\r\n])?---(?:\r?\n|$)/.test(markdown);
  let frontMatterStarted = false;
  const syntax = { end: '', quote: '', brackets: 0, subset: 0 };
  let previousIsBlank = true;

  lines.forEach((line) => {
    const isBlank = BLANK_LINE.test(line);
    const canSplit = !inFence && !inFrontMatter && !syntax.end && !syntax.brackets;
    if (/^\r?\n$/.test(line) && !previousIsBlank && canSplit) {
      pendingSplit = current.length;
    }
    if (!isBlank && pendingSplit > 0) {
      if (!FRONT_MATTER_FENCE.test(line)) {
        blocks.push(current.slice(0, pendingSplit));
        current = current.slice(pendingSplit);
      }
      pendingSplit = -1;
    }
    current += line;
    previousIsBlank = isBlank;

    if (inFrontMatter) {
      if (FRONT_MATTER_FENCE.test(line)) {
        inFrontMatter = !frontMatterStarted;
        frontMatterStarted = true;
      }
      return;
    }
    if (inFence) {
      inFence = !FENCE_CLOSE.test(line);
      return;
    }
    if (!syntax.end && FENCE_OPEN.test(line)) {
      inFence = true;
      return;
    }
    updateSyntax(line, syntax);
  });
  if (current) {
    blocks.push(current);
  }
  return blocks;
}

// Keep potential multiline Prism tokens together. Unclosed syntax conservatively
// keeps the rest of the document in one block until the user closes it.
function updateSyntax(line: string, state: { end: string; quote: string; brackets: number; subset: number }) {
  let reference = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (state.end && state.end !== '>') {
      const end = line.indexOf(state.end, i);
      if (end === -1) return;
      i = end + state.end.length - 1;
      state.end = '';
      continue;
    }
    if (state.end === '>') {
      if (state.quote) {
        if (char === state.quote) state.quote = '';
      } else if (char === '"' || char === "'") {
        state.quote = char;
      } else if (char === '[') {
        state.subset++;
      } else if (char === ']' && state.subset) {
        state.subset--;
      } else if (char === '>' && !state.subset) {
        state.end = '';
      }
      continue;
    }
    if (char === '\\') {
      i++;
    } else if (char === '<' && /[a-z!?/]/i.test(line[i + 1] || '')) {
      state.end = line.startsWith('<!--', i)
        ? '-->'
        : line.startsWith('<![CDATA[', i)
          ? ']]>'
          : line.startsWith('<?', i)
            ? '?>'
            : '>';
    } else if (char === '[') {
      state.brackets++;
    } else if (char === ']') {
      state.brackets = Math.max(0, state.brackets - 1);
      reference = line[i + 1] === ':';
    } else if (reference && (char === '"' || char === "'" || char === '(')) {
      state.end = char === '(' ? ')' : char;
    }
  }
}
