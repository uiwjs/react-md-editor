import rehypePrism from 'rehype-prism-plus';
import { createMarkdown } from './Markdown.factory';

export type { MarkdownProps } from './Markdown.factory';

export default createMarkdown(rehypePrism);
