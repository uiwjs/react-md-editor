/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MDEditor from '../core/src';
import MDEditorCommon from '../core/src/index.common';
import MDEditorNoHighlight from '../core/src/index.nohighlight';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const modeEditors = [
  ['default', MDEditor],
  ['common', MDEditorCommon],
  ['nohighlight', MDEditorNoHighlight],
] as const;

describe('XSS Security Regression Tests', () => {
  describe('Default XSS Protection - MDEditor Component', () => {
    describe.each(modeEditors)('%s mode: default sanitization', (modeName, EditorComponent) => {
      it('should sanitize script tags by default', () => {
        const xssContent = 'Hello <script>alert("xss")</script> World';
        const { container } = render(
          <EditorComponent
            value={xssContent}
            preview="preview"
            textareaProps={{ title: `${modeName}-script` }}
          />,
        );

        const scripts = container.querySelectorAll('script');
        expect(scripts.length).toBe(0);
        expect(container).toHaveTextContent('Hello');
        expect(container).toHaveTextContent('World');
      });

      it('should sanitize iframe with javascript: protocol by default', () => {
        const xssContent = '<iframe src="javascript:alert(1)"></iframe>';
        const { container } = render(
          <EditorComponent
            value={xssContent}
            preview="preview"
            textareaProps={{ title: `${modeName}-iframe` }}
          />,
        );

        const iframes = container.querySelectorAll('iframe');
        iframes.forEach((iframe) => {
          const src = iframe.getAttribute('src');
          if (src) {
            expect(src.toLowerCase()).not.toMatch(/^javascript:/i);
          }
        });
      });

      it('should sanitize img onerror events by default', () => {
        const xssContent = '<img src="invalid.jpg" onerror="alert(1)" />';
        const { container } = render(
          <EditorComponent
            value={xssContent}
            preview="preview"
            textareaProps={{ title: `${modeName}-img` }}
          />,
        );

        const imgs = container.querySelectorAll('img');
        imgs.forEach((img) => {
          expect(img.hasAttribute('onerror')).toBe(false);
          expect(img.hasAttribute('onload')).toBe(false);
        });
      });

      it('should sanitize svg onload events by default', () => {
        const xssContent = '<svg onload="alert(1)"></svg>';
        const { container } = render(
          <EditorComponent
            value={xssContent}
            preview="preview"
            textareaProps={{ title: `${modeName}-svg` }}
          />,
        );

        const svgs = container.querySelectorAll('svg');
        svgs.forEach((svg) => {
          expect(svg.hasAttribute('onload')).toBe(false);
        });
      });

      it('should sanitize anchor tags with javascript: href by default', () => {
        const xssContent = '[Click me](javascript:alert(1))';
        const { container } = render(
          <EditorComponent
            value={xssContent}
            preview="preview"
            textareaProps={{ title: `${modeName}-anchor` }}
          />,
        );

        const links = container.querySelectorAll('a');
        links.forEach((link) => {
          const href = link.getAttribute('href');
          if (href) {
            expect(href.toLowerCase()).not.toMatch(/^javascript:/i);
          }
        });
      });

      it('should sanitize form action with javascript: by default', () => {
        const xssContent = '<form action="javascript:alert(1)"><input type="submit" /></form>';
        const { container } = render(
          <EditorComponent
            value={xssContent}
            preview="preview"
            textareaProps={{ title: `${modeName}-form` }}
          />,
        );

        const forms = container.querySelectorAll('form');
        forms.forEach((form) => {
          const action = form.getAttribute('action');
          if (action) {
            expect(action.toLowerCase()).not.toMatch(/^javascript:/i);
          }
        });
      });

      it('should preserve safe HTML tags by default', () => {
        const safeContent = '<h1>Title</h1><p>Paragraph with <strong>bold</strong> and <em>italic</em> text</p>';
        const { container } = render(
          <EditorComponent
            value={safeContent}
            preview="preview"
            textareaProps={{ title: `${modeName}-safe-html` }}
          />,
        );

        expect(container.querySelector('h1')).toBeInTheDocument();
        expect(container.querySelector('p')).toBeInTheDocument();
        expect(container.querySelector('strong')).toBeInTheDocument();
        expect(container.querySelector('em')).toBeInTheDocument();
      });
    });
  });

  describe('User Configuration Compatibility', () => {
    describe('Custom rehype-sanitize schema', () => {
      it('should respect user-defined rehype-sanitize schema', () => {
        const content = '<span class="custom-class">Custom styled text</span>';
        const { container } = render(
          <MDEditor
            value={content}
            preview="preview"
            textareaProps={{ title: 'custom-schema' }}
            previewOptions={{
              rehypePlugins: [
                [
                  rehypeSanitize,
                  {
                    ...defaultSchema,
                    attributes: {
                      ...defaultSchema.attributes,
                      span: [
                        // @ts-ignore
                        ...(defaultSchema.attributes?.span || []),
                        ['className'],
                      ],
                    },
                  },
                ],
              ],
            }}
          />,
        );

        const span = container.querySelector('span.custom-class');
        expect(span).toBeInTheDocument();
        expect(span).toHaveTextContent('Custom styled text');
      });

      it('should use user-configured rehype-sanitize instead of default when explicitly provided', () => {
        const xssContent = 'Hello <script>alert("xss")</script> <b>World</b>';
        const { container } = render(
          <MDEditor
            value={xssContent}
            preview="preview"
            textareaProps={{ title: 'user-sanitize' }}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />,
        );

        const scripts = container.querySelectorAll('script');
        expect(scripts.length).toBe(0);
        expect(container).toHaveTextContent('Hello');
        expect(container).toHaveTextContent('World');
      });
    });

    describe('Custom rehype plugins', () => {
      it('should merge default sanitize with user rehype plugins', () => {
        const mockRehypePlugin = jest.fn(() => (tree: any) => tree);
        const xssContent = '<script>alert(1)</script> Safe text';

        render(
          <MDEditor
            value={xssContent}
            preview="preview"
            textareaProps={{ title: 'merge-plugins' }}
            previewOptions={{
              rehypePlugins: [mockRehypePlugin],
            }}
          />,
        );

        const scripts = document.querySelectorAll('script');
        expect(scripts.length).toBe(0);
        expect(document.body).toHaveTextContent('Safe text');
        expect(mockRehypePlugin).toHaveBeenCalled();
      });

      it('should allow multiple rehype plugins including sanitize', () => {
        const mockPlugin1 = jest.fn(() => (tree: any) => tree);
        const mockPlugin2 = jest.fn(() => (tree: any) => tree);
        const xssContent = '<script>alert(1)</script> <b>Safe</b>';

        render(
          <MDEditor
            value={xssContent}
            preview="preview"
            textareaProps={{ title: 'multiple-plugins' }}
            previewOptions={{
              rehypePlugins: [
                mockPlugin1,
                [rehypeSanitize],
                mockPlugin2,
              ],
            }}
          />,
        );

        const scripts = document.querySelectorAll('script');
        expect(scripts.length).toBe(0);
        expect(document.body).toHaveTextContent('Safe');
        expect(mockPlugin1).toHaveBeenCalled();
        expect(mockPlugin2).toHaveBeenCalled();
      });

      it('should not duplicate sanitize when user already includes it', () => {
        const xssContent = '<script>alert(1)</script> Safe';

        const { container } = render(
          <MDEditor
            value={xssContent}
            preview="preview"
            textareaProps={{ title: 'no-duplicate' }}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />,
        );

        const scripts = container.querySelectorAll('script');
        expect(scripts.length).toBe(0);
        expect(container).toHaveTextContent('Safe');
      });
    });

    describe('Custom preview component', () => {
      it('should allow complete override via components.preview', () => {
        const customPreviewText = 'Custom Preview Rendered';
        const mockPreview = jest.fn(() => <div data-testid="custom-preview">{customPreviewText}</div>);

        const { getByTestId } = render(
          <MDEditor
            value="# Test"
            preview="preview"
            textareaProps={{ title: 'custom-preview' }}
            components={{
              preview: mockPreview,
            }}
          />,
        );

        expect(getByTestId('custom-preview')).toBeInTheDocument();
        expect(getByTestId('custom-preview')).toHaveTextContent(customPreviewText);
        expect(mockPreview).toHaveBeenCalled();
      });

      it('should pass correct source to custom preview component', () => {
        const testMarkdown = '# Test Content\n\nSome text';
        let capturedSource: string | undefined;

        const mockPreview = jest.fn((source: string) => {
          capturedSource = source;
          return <div data-testid="custom-preview">{source}</div>;
        });

        render(
          <MDEditor
            value={testMarkdown}
            preview="preview"
            textareaProps={{ title: 'custom-preview-args' }}
            components={{
              preview: mockPreview,
            }}
          />,
        );

        expect(mockPreview).toHaveBeenCalled();
        expect(capturedSource).toBe(testMarkdown);
      });

      it('should not apply default sanitize when using custom preview component - SECURITY RISK', () => {
        const xssContent = '<script class="xss-test">alert("xss")</script>';
        let capturedSource: string | undefined;

        const mockPreview = jest.fn((source: string) => {
          capturedSource = source;
          return <div data-testid="custom-preview">{source}</div>;
        });

        render(
          <MDEditor
            value={xssContent}
            preview="preview"
            textareaProps={{ title: 'custom-preview-safety' }}
            components={{
              preview: mockPreview,
            }}
          />,
        );

        expect(mockPreview).toHaveBeenCalled();
        expect(capturedSource).toBe(xssContent);
        expect(capturedSource).toContain('<script');
      });
    });

    describe('Other previewOptions', () => {
      it('should pass className from previewOptions', () => {
        const customClassName = 'custom-preview-class';
        const { container } = render(
          <MDEditor
            value="# Test"
            preview="preview"
            textareaProps={{ title: 'preview-options-class' }}
            previewOptions={{
              className: customClassName,
            }}
          />,
        );

        const previewElement = container.querySelector('.w-md-editor-preview');
        expect(previewElement).toHaveClass(customClassName);
      });
    });
  });

  describe('MDEditor.Markdown Static Component', () => {
    it('does NOT have default XSS protection - IMPORTANT SECURITY NOTE', () => {
      const xssContent = '<script class="xss-test">alert("xss")</script>';

      const { container } = render(
        <MDEditor.Markdown source={xssContent} />,
      );

      const scripts = container.querySelectorAll('script.xss-test');
      expect(scripts.length).toBeGreaterThan(0);
    });

    it('should respect rehype-sanitize when explicitly configured', () => {
      const xssContent = 'Hello <script>alert("xss")</script> World';
      const { container } = render(
        <MDEditor.Markdown
          source={xssContent}
          rehypePlugins={[[rehypeSanitize]]}
        />,
      );

      const scripts = container.querySelectorAll('script');
      expect(scripts.length).toBe(0);
      expect(container).toHaveTextContent('Hello');
      expect(container).toHaveTextContent('World');
    });

    it('should work with custom rehype-sanitize schema', () => {
      const content = '<span class="my-class">Styled text</span>';
      const { container } = render(
        <MDEditor.Markdown
          source={content}
          rehypePlugins={[
            [
              rehypeSanitize,
              {
                ...defaultSchema,
                attributes: {
                  ...defaultSchema.attributes,
                  span: [
                    // @ts-ignore
                    ...(defaultSchema.attributes?.span || []),
                    ['className'],
                  ],
                },
              },
            ],
          ]}
        />,
      );

      const span = container.querySelector('span.my-class');
      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('Styled text');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty previewOptions gracefully AND apply default sanitize', () => {
      const xssContent = '<script>alert(1)</script> <h1>Title</h1>';
      const { container } = render(
        <MDEditor
          value={xssContent}
          preview="preview"
          textareaProps={{ title: 'empty-options' }}
          previewOptions={{}}
        />,
      );

      const scripts = container.querySelectorAll('script');
      expect(scripts.length).toBe(0);
      expect(container.querySelector('h1')).toBeInTheDocument();
      expect(container.querySelector('h1')).toHaveTextContent('Title');
    });

    it('should handle markdown without HTML', () => {
      const markdown = '# Title\n\nThis is **bold** and *italic* text.\n\n- List item 1\n- List item 2';
      const { container } = render(
        <MDEditor
          value={markdown}
          preview="preview"
          textareaProps={{ title: 'no-html' }}
        />,
      );

      expect(container.querySelector('h1')).toHaveTextContent('Title');
      expect(container.querySelector('strong')).toHaveTextContent('bold');
      expect(container.querySelector('em')).toHaveTextContent('italic');
    });

    it('should sanitize nested dangerous HTML', () => {
      const nestedXss = '<div><script>alert(1)</script><p>Safe text</p></div>';
      const { container } = render(
        <MDEditor
          value={nestedXss}
          preview="preview"
          textareaProps={{ title: 'nested-html' }}
        />,
      );

      const scripts = container.querySelectorAll('script');
      expect(scripts.length).toBe(0);
      expect(container).toHaveTextContent('Safe text');
    });

    it('should sanitize data URI schemes', () => {
      const xssContent = '<img src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==" />';
      const { container } = render(
        <MDEditor
          value={xssContent}
          preview="preview"
          textareaProps={{ title: 'data-uri' }}
        />,
      );

      const imgs = container.querySelectorAll('img');
      imgs.forEach((img) => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('data:')) {
          expect(src).not.toMatch(/text\/html/i);
        }
      });
    });
  });
});
