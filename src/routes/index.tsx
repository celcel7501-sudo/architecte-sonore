import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppTabBar, type MobilePane } from "@/components/app-tabbar";
import { BriefForm } from "@/components/brief-form";
import { EmptyScore, ErrorScore, LoadingScore } from "@/components/empty-score";
import { HistoryPanel } from "@/components/history-panel";
import { InstallApp } from "@/components/install-app";
import { ScoreView } from "@/components/score-view";
import { StudioHeader } from "@/components/studio-header";
import { generateSong, packLyricsForSuno, rewriteScorePart, type RewritePart } from "@/lib/generate";
import { loadHistory, pushHistory, removeHistory } from "@/lib/history";
import { presets } from "@/lib/presets";
import type { Brief, HistoryItem, Score } from "@/lib/types";
import { defaultBrief } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [brief, setBrief] = useState<Brief>(defaultBrief);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [score, setScore] = useState<Score | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [packing, setPacking] = useState(false);
  const [rewriting, setRewriting] = useState<RewritePart | null>(null);
  const [mobilePane, setMobilePane] = useState<MobilePane>("brief");

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const showScore = useCallback(() => {
    setMobilePane("score");
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }, []);

  const saveScore = useCallback((nextScore: Score, nextBrief: Brief) => {
    const item: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      title: nextScore.title,
      hook: nextScore.hook,
      brief: nextBrief,
      score: nextScore,
    };
    setHistory(pushHistory(item));
  }, []);

  const compose = useCallback(async () => {
    setGenerating(true);
    setGenError(null);
    showScore();
    try {
      const result = await generateSong({ data: brief });
      if (!result.ok) {
        setGenError(result.error);
        toast.error(result.error);
        return;
      }
      setScore(result.score);
      saveScore(result.score, brief);
      toast.success("Partition terminée.");
    } catch {
      const message = "La composition a échoué. Réessaie.";
      toast.error(message);
      setGenError(message);
    } finally {
      setGenerating(false);
    }
  }, [brief, saveScore, showScore]);

  const packSuno = useCallback(async () => {
    if (!score) return;
    setPacking(true);
    showScore();
    try {
      const result = await packLyricsForSuno({ data: { brief, score } });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      const sunoBrief: Brief = { ...brief, skill: "suno" };
      setScore(result.score);
      setBrief(sunoBrief);
      saveScore(result.score, sunoBrief);
      toast.success("Paroles conservées. Style et exclusions à jour.");
    } catch {
      toast.error("Le pack Suno a échoué. Réessaie.");
    } finally {
      setPacking(false);
    }
  }, [brief, saveScore, score, showScore]);

  const rewrite = useCallback(
    async (part: RewritePart) => {
      if (!score) return;
      setRewriting(part);
      showScore();
      try {
        const result = await rewriteScorePart({ data: { brief, score, part } });
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        setScore(result.score);
        saveScore(result.score, brief);
        const label = part === "hook" ? "Nouveau hook" : part === "v2" ? "Nouveau couplet 2" : "Version C";
        toast.success(label);
      } catch {
        toast.error("La relance a échoué.");
      } finally {
        setRewriting(null);
      }
    },
    [brief, saveScore, score, showScore],
  );

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <StudioHeader historyCount={history.length} onOpenHistory={() => setHistoryOpen(true)} />
      <main className="mx-auto grid w-full max-w-[1440px] flex-1 gap-6 px-4 py-6 pb-24 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:px-8 lg:pb-10">
        <section className={cn("min-w-0", mobilePane !== "brief" && "hidden lg:block")}>
          <BriefForm
            brief={brief}
            onChange={(next) => {
              setBrief(next);
              setActivePresetId(null);
            }}
            onSubmit={compose}
            generating={generating}
            activePresetId={activePresetId}
            onPreset={(id) => {
              const preset = presets.find((item) => item.id === id);
              if (!preset) return;
              setBrief(preset.brief);
              setActivePresetId(id);
            }}
          />
        </section>

        <section
          aria-live="polite"
          aria-busy={generating}
          className={cn("min-w-0 lg:sticky lg:top-[92px]", mobilePane !== "score" && "hidden lg:block")}
        >
          {generating ? (
            <LoadingScore skill={brief.skill} />
          ) : genError ? (
            <ErrorScore message={genError} onRetry={compose} />
          ) : score ? (
            <ScoreView
              score={score}
              onPackSuno={packSuno}
              packing={packing}
              onRewrite={rewrite}
              rewriting={rewriting}
            />
          ) : (
            <EmptyScore skill={brief.skill} />
          )}
        </section>

        <section className={cn("min-w-0 lg:hidden", mobilePane !== "install" && "hidden")}>
          <InstallApp />
        </section>
      </main>

      <AppTabBar active={mobilePane} onChange={setMobilePane} />

      {historyOpen ? (
        <HistoryPanel
          items={history}
          onRestore={(item) => {
            setBrief(item.brief);
            setScore(item.score);
            setGenError(null);
            setActivePresetId(null);
            setHistoryOpen(false);
            showScore();
          }}
          onRemove={(id) => setHistory(removeHistory(id))}
          onClose={() => setHistoryOpen(false)}
        />
      ) : null}
    </div>
  );
}
