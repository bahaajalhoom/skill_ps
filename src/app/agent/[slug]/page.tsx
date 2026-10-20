import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_AGENTS, getAgentBySlug } from "@/data/agents";
import { Navbar } from "@/components/Navbar";
import { CopyButton } from "@/components/CopyButton";
import { ExternalLink, Terminal, Sparkles, ChevronRight, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

interface AgentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_AGENTS.map((agent) => ({
    slug: agent.slug,
  }));
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = getAgentBySlug(slug);

  if (!agent) {
    return {
      title: "Agent Not Found | skill_ps",
    };
  }

  return {
    title: `Skills for ${agent.name} — Install via skills CLI`,
    description: agent.intro,
  };
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const agent = getAgentBySlug(slug);

  if (!agent) {
    notFound();
  }

  const otherAgents = ALL_AGENTS.filter((a) => a.slug !== agent.slug);

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col gap-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <Link href="/" className="hover:text-neutral-300 transition-colors">
            skills
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <Link href="/agent" className="hover:text-neutral-300 transition-colors">
            agents
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-neutral-300 font-medium">{agent.name}</span>
        </nav>

        {/* Hero Section */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-8 border-b border-neutral-800">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center p-3.5 shrink-0 shadow-lg shadow-black/60">
            <Image
              src={agent.icon}
              alt={agent.name}
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                Skills for {agent.name}
              </h1>
              {agent.badge && (
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {agent.badge}
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl">
              {agent.intro}
            </p>
          </div>
        </header>

        {/* Section 1: Install Skills on Agent */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-neutral-300">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h2>Install skills on {agent.name}</h2>
          </div>

          <p className="text-sm text-neutral-400 leading-relaxed">
            The skills CLI installs <code className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-xs">SKILL.md</code> files into your repository so {agent.name} agents reference them automatically when working on the project. Run the command below from your project root:
          </p>

          {/* Terminal Command Box */}
          <div className="flex items-center justify-between gap-4 p-4 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-sm text-neutral-200 group hover:border-neutral-700 transition-colors shadow-inner">
            <div className="flex items-center gap-3 overflow-x-auto select-all">
              <span className="text-emerald-500 font-bold select-none">$</span>
              <span className="text-white font-medium">{agent.installCmd}</span>
            </div>
            <CopyButton text={agent.installCmd} label="Copy" />
          </div>

          {/* Agent Native Command if available */}
          {agent.nativeCmd && (
            <div className="flex items-center justify-between gap-4 p-3.5 bg-neutral-900/50 border border-neutral-800/80 rounded-xl font-mono text-xs text-neutral-300">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Direct command:</span>
                <span className="text-neutral-200">{agent.nativeCmd}</span>
              </div>
              <CopyButton text={agent.nativeCmd} label="Copy" />
            </div>
          )}

          <p className="text-xs text-neutral-500 font-mono">
            New to skills? Browse the{" "}
            <Link href="/" className="text-emerald-400 hover:underline underline-offset-4">
              full directory
            </Link>{" "}
            of 1.4M+ agent skills.
          </p>
        </section>

        {/* Section 2: Skills Frequently Used with Agent */}
        {agent.topics && agent.topics.length > 0 && (
          <section className="flex flex-col gap-4 pt-4 border-t border-neutral-800/80">
            <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-neutral-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2>Skills frequently used with {agent.name}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {agent.topics.map((topic, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col gap-1.5 group"
                >
                  <h3 className="text-sm font-semibold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {topic.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Visit Agent Website */}
        <section className="flex flex-col gap-3 pt-4 border-t border-neutral-800/80">
          <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-300">
            Visit {agent.name}
          </h2>
          <p className="text-sm text-neutral-400">
            Learn more, sign up, or download {agent.name} at{" "}
            <a
              href={agent.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline underline-offset-4 font-medium inline-flex items-center gap-1"
            >
              {agent.websiteName}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            .
          </p>
        </section>

        {/* Section 4: Other Agents */}
        <section className="flex flex-col gap-4 pt-4 border-t border-neutral-800/80 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono uppercase tracking-wider text-neutral-300">
              Other agents
            </h2>
            <Link href="/agent" className="text-xs font-mono text-neutral-500 hover:text-emerald-400 transition-colors">
              View all ({ALL_AGENTS.length}) →
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {otherAgents.map((other) => (
              <Link
                key={other.slug}
                href={`/agent/${other.slug}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 hover:text-white transition-all font-mono"
              >
                <Image
                  src={other.icon}
                  alt={other.name}
                  width={14}
                  height={14}
                  className="object-contain"
                />
                <span>{other.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
