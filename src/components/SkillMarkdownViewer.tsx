"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SkillMarkdownViewerProps {
  content: string;
}

export function SkillMarkdownViewer({ content }: SkillMarkdownViewerProps) {
  // Extract and clean frontmatter if present
  let frontmatter: Record<string, string> = {};
  let body = content;

  if (content.startsWith("---")) {
    const endIdx = content.indexOf("---", 3);
    if (endIdx !== -1) {
      const rawFm = content.slice(3, endIdx).trim();
      body = content.slice(endIdx + 3).trim();

      rawFm.split("\n").forEach((line) => {
        const colonIdx = line.indexOf(":");
        if (colonIdx > 0) {
          const key = line.slice(0, colonIdx).trim();
          const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
          frontmatter[key] = val;
        }
      });
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Frontmatter Metadata Pill Card */}
      {Object.keys(frontmatter).length > 0 && (
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/10 space-y-2 font-mono text-xs">
          <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">
            Skill Metadata (Frontmatter)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {Object.entries(frontmatter).map(([k, v]) => (
              <div key={k} className="flex flex-col bg-neutral-950/80 p-2.5 rounded-lg border border-white/5">
                <span className="text-neutral-500 text-[10px] uppercase">{k}</span>
                <span className="text-neutral-200 mt-0.5 break-words">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Markdown Body */}
      <div className="prose prose-invert max-w-none text-neutral-300 leading-relaxed text-sm sm:text-base space-y-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold font-mono text-white tracking-tight border-b border-white/10 pb-2 mb-4">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-semibold font-mono text-white tracking-tight mt-6 mb-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-semibold text-neutral-200 mt-4 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="leading-relaxed text-neutral-300 mb-3">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 space-y-1 text-neutral-300 mb-4">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 space-y-1 text-neutral-300 mb-4">{children}</ol>
            ),
            code: ({ inline, className, children, ...props }: any) => {
              if (inline) {
                return (
                  <code
                    className="px-1.5 py-0.5 rounded bg-neutral-800 text-emerald-400 font-mono text-xs border border-white/10"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <div className="my-3 rounded-lg overflow-hidden border border-white/10 bg-neutral-950 p-3 font-mono text-xs text-neutral-200 overflow-x-auto">
                  <code>{children}</code>
                </div>
              );
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-emerald-500 pl-4 py-1 italic text-neutral-400 my-3 bg-neutral-900/30 rounded-r">
                {children}
              </blockquote>
            ),
          }}
        >
          {body}
        </ReactMarkdown>
      </div>
    </div>
  );
}
