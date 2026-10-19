"use client";

import React, { useState } from "react";
import { X, Github, Plus, Loader2, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillAdded: () => void;
}

export function AddSkillModal({ isOpen, onClose, onSkillAdded }: AddSkillModalProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"import" | "create">("import");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Import fields
  const [githubRepo, setGithubRepo] = useState("");

  // Create fields
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("workflow");
  const [markdownContent, setMarkdownContent] = useState("");

  if (!isOpen) return null;

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const cleanRepo = githubRepo.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
      const parts = cleanRepo.split("/");
      if (parts.length < 2) {
        throw new Error("Please enter a valid GitHub repository in format 'owner/repo'");
      }

      const owner = parts[0];
      const repo = parts[1];
      const skillName = parts[2] || repo;

      const res = await fetch("/api/custom-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: skillName,
          source: `${owner}/${repo}`,
          description: `Imported skill from https://github.com/${owner}/${repo}`,
          category: "imported",
          markdownContent: `# ${skillName}\n\nImported from [${owner}/${repo}](https://github.com/${owner}/${repo}).\n\nRun:\n\`\`\`bash\nnpx skills add https://github.com/${owner}/${repo} --skill ${skillName}\n\`\`\``,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to import skill");
      }

      setSuccess(true);
      setTimeout(() => {
        onSkillAdded();
        onClose();
        setSuccess(false);
        setGithubRepo("");
      }, 1000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!name.trim() || !source.trim()) {
        throw new Error("Name and source repository are required.");
      }

      const res = await fetch("/api/custom-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          source: source.trim(),
          description: description.trim(),
          category,
          markdownContent: markdownContent.trim() || `# ${name}\n\nCustom agent skill workflow.`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create skill");
      }

      setSuccess(true);
      setTimeout(() => {
        onSkillAdded();
        onClose();
        setSuccess(false);
        setName("");
        setSource("");
        setDescription("");
        setMarkdownContent("");
      }, 1000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-neutral-950 border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-neutral-900/40">
          <h2 className="text-base sm:text-lg font-bold font-mono text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            {t("addSkill")}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 font-mono text-xs">
          <button
            onClick={() => setActiveTab("import")}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-2 ${
              activeTab === "import"
                ? "bg-neutral-900 text-white border-b-2 border-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            {t("importFromGithub")}
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-2 ${
              activeTab === "create"
                ? "bg-neutral-900 text-white border-b-2 border-white"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            {t("createCustom")}
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          {success ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-emerald-400 font-mono text-sm">
              <Check className="w-8 h-8 p-1 rounded-full bg-emerald-500/20" />
              <span>Skill added to your catalog successfully!</span>
            </div>
          ) : activeTab === "import" ? (
            <form onSubmit={handleImport} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-neutral-400 mb-1.5">
                  {t("repoSource")}
                </label>
                <input
                  type="text"
                  required
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="e.g. vercel-labs/skills or owner/repo/skill-name"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Enter any public GitHub repository to index its skills into your store.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{t("importFromGithub")}</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreate} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">{t("skillName")}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. database-migrator"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{t("repoSource")}</label>
                <input
                  type="text"
                  required
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. my-org/agent-skills"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{t("skillDescription")}</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Automatically generates safe database migrations"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">{t("markdownBody")}</label>
                <textarea
                  rows={4}
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  placeholder="# My Skill Instructions..."
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{t("saveSkill")}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
