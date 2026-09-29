import { useEffect, useState, type ReactNode } from "react";
import { Check, Download, Laptop, MoreVertical, PlusSquare, Share, ShieldCheck } from "lucide-react";
import { ArchitectMark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { detectInstallPlatform, isStandaloneApp } from "@/lib/install";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallApp() {
  const [installed, setInstalled] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | "desktop">("desktop");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setInstalled(isStandaloneApp());
    setPlatform(detectInstallPlatform());

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function installNative() {
    if (!deferred) return;
    setBusy(true);
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
    } finally {
      setBusy(false);
      setDeferred(null);
    }
  }

  if (installed) {
    return (
      <div className="studio-grid flex min-h-[540px] flex-col justify-center rounded-2xl border border-line bg-surface/40 p-6">
        <span className="grid size-14 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary">
          <Check className="size-6" />
        </span>
        <div className="mt-7 grid max-w-md gap-3">
          <p className="font-display text-4xl leading-tight">Le studio est installé.</p>
          <p className="text-sm leading-6 text-muted">
            Ouvre L’Architecte depuis son icône. Tes partitions restent dans l’historique de cet appareil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-4">
      <div className="studio-grid rounded-2xl border border-line bg-surface/40 p-6">
        <ArchitectMark className="size-14 text-primary" />
        <p className="mt-8 text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">Application web</p>
        <h1 className="mt-2 font-display text-4xl leading-tight">Le studio, depuis ton écran d’accueil.</h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-muted">
          Pas de store ni de compte. Installe cette page pour l’ouvrir en plein écran avec une icône dédiée.
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs text-muted">
          <ShieldCheck className="size-4 text-primary" />
          Historique local, conservé uniquement ici
        </div>
      </div>

      {deferred ? (
        <Button type="button" onClick={installNative} disabled={busy} className="w-full gap-2">
          <Download className="size-4" />
          {busy ? "Installation…" : "Installer maintenant"}
        </Button>
      ) : null}

      <div>
        <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-subtle uppercase">
          {platform === "ios" ? "Sur iPhone ou iPad" : platform === "android" ? "Sur Android" : "Sur ordinateur"}
        </p>
        {platform === "ios" ? <IosSteps /> : platform === "android" ? <AndroidSteps /> : <DesktopSteps />}
      </div>
    </div>
  );
}

function AndroidSteps() {
  return (
    <ol className="grid gap-3">
      <Step n={1} icon={<MoreVertical className="size-4" />} title="Ouvre le menu Chrome">Appuie sur les trois points en haut à droite.</Step>
      <Step n={2} icon={<Download className="size-4" />} title="Choisis Installer">Selon Chrome : « Installer l’application » ou « Ajouter à l’écran d’accueil ».</Step>
      <Step n={3} icon={<PlusSquare className="size-4" />} title="Confirme">L’icône apparaît avec tes autres applications.</Step>
    </ol>
  );
}

function IosSteps() {
  return (
    <ol className="grid gap-3">
      <Step n={1} icon={<Share className="size-4" />} title="Ouvre Partager">Dans Safari, appuie sur le carré avec la flèche.</Step>
      <Step n={2} icon={<PlusSquare className="size-4" />} title="Sur l’écran d’accueil">Fais défiler la feuille de partage et sélectionne cette option.</Step>
      <Step n={3} icon={<Download className="size-4" />} title="Ajoute">Confirme le nom et l’icône du studio.</Step>
    </ol>
  );
}

function DesktopSteps() {
  return (
    <ol className="grid gap-3">
      <Step n={1} icon={<Laptop className="size-4" />} title="Repère l’icône d’installation">Dans Chrome ou Edge, elle se trouve à droite de la barre d’adresse.</Step>
      <Step n={2} icon={<Download className="size-4" />} title="Installe l’application">Clique sur Installer. Le studio s’ouvrira dans sa propre fenêtre.</Step>
    </ol>
  );
}

function Step({ n, icon, title, children }: { n: number; icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3 rounded-xl border border-line bg-surface p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-elevated text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-fg">{n}. {title}</p>
        <p className="mt-1 text-sm leading-5 text-muted">{children}</p>
      </div>
    </li>
  );
}
