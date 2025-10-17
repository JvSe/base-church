import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

type MarkdownViewerProps = {
  content: string;
};

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="dark-text-primary mt-8 mb-4 text-3xl font-bold first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="dark-text-primary mt-6 mb-3 text-2xl font-semibold">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="dark-text-primary mt-4 mb-2 text-xl font-semibold">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="dark-text-primary mt-4 mb-2 text-lg font-semibold">
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="dark-text-secondary mb-4 leading-relaxed">
              {children}
            </p>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="dark-text-secondary mb-4 ml-6 list-disc space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="dark-text-secondary mb-4 ml-6 list-decimal space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,

          // Links
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="dark-primary hover:dark-primary-hover font-medium underline decoration-2 underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),

          // Code
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="dark-bg-tertiary dark-text-primary rounded px-2 py-1 font-mono text-sm">
                  {children}
                </code>
              );
            }
            // Block code - handled by rehype-highlight
            return <code className={className}>{children}</code>;
          },
          pre: ({ children }) => (
            <pre className="dark-bg-secondary mb-4 overflow-x-auto rounded-lg p-4">
              {children}
            </pre>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="dark-border-l-primary dark-bg-secondary my-4 border-l-4 py-2 pl-4 italic">
              {children}
            </blockquote>
          ),

          // Horizontal Rule
          hr: () => <hr className="dark-border my-6 border-t" />,

          // Tables
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto">
              <table className="dark-border w-full border-collapse border">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="dark-bg-secondary">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="dark-border border-t">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="dark-text-primary dark-border border px-4 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="dark-text-secondary dark-border border px-4 py-2">
              {children}
            </td>
          ),

          // Strong/Bold
          strong: ({ children }) => (
            <strong className="dark-text-primary font-bold">{children}</strong>
          ),

          // Emphasis/Italic
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
