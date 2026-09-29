import { chromium } from "playwright-core";
import assert from "node:assert/strict";

const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const sampleBrief = {
  skill: "chanson",
  school: "soul cinéma 90s",
  hookMachine: "slogan",
  theme: "Une table, deux baffles, la dernière rame.",
  emotion: "fier, lucide",
  genre: "rap soul",
  era: "90s",
  performer: "homme, baryton posé",
  energy: 7,
  bpm: "96",
  ambience: "dry drums, soul chop",
  scratches: "subtils",
  language: "français",
  mustInclude: "la dalle",
  avoid: "trap, EDM",
  duration: "environ 3:00",
  goal: "tube radio",
};
const sampleScore = {
  skill: "chanson",
  concept: "Une scène de fin de journée qui transforme la fatigue en devise collective.",
  title: "La dalle tient debout",
  hook: "La dalle tient debout",
  hookAlts: ["On tient encore", "Rien ne nous plie"],
  styleOfMusic: "French soul boom bap, 96 BPM, laid-back pocket, dry kick, snappy snare, analog bass, three-note soul chop, warm baritone rap lead, proud nocturnal mood, centered vocal, narrow verses, wider chorus, vinyl heat.",
  excludeStyles: "trap hats, EDM drop, drill bass, glossy pop, comedy, spoken intro",
  lyrics: "[Intro]\nLe jour baisse.\n\n[Verse 1]\nDeux baffles sur la table\nLa fenêtre tient le cadre\n\n[Chorus]\nLa dalle tient debout\nLa dalle tient debout\n\n[Verse 2]\nLe cousin compte les heures\nOn garde le fil au cœur\n\n[Final Chorus]\nLa dalle tient debout\nEt demain vient à nous",
  arrangement: [
    { section: "Intro", energy: "3/10", musical: "Soul chop filtré", vocal: "Ad-libs lointains" },
    { section: "Chorus", energy: "8/10", musical: "Batterie pleine", vocal: "Lead doublé" },
  ],
  variations: [
    { name: "Version radio", bpm: "96", instruments: "Soul chop, basse", voice: "Baryton", energy: "7/10", arrangement: "3:00 serré" },
  ],
  quality: [{ criterion: "Hook", score: 9, correction: "Aucune" }],
};
const historyItem = {
  id: "smoke-1",
  createdAt: Date.now(),
  title: sampleScore.title,
  hook: sampleScore.hook,
  brief: sampleBrief,
  score: sampleScore,
};

try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const desktopPage = await desktop.newPage();
  await desktopPage.goto(baseURL, { waitUntil: "networkidle" });
  await desktopPage.getByRole("button", { name: /Style Finger/ }).click();
  assert.equal(await desktopPage.locator("#bpm").inputValue(), "96");
  assert.match(await desktopPage.locator("#theme").inputValue(), /deux baffles/);
  await desktopPage.getByRole("button", { name: "Composer le morceau" }).click();
  await desktopPage.getByText("Le studio a perdu le fil.").waitFor({ timeout: 10_000 });
  assert.match(await desktopPage.locator("body").innerText(), /composition n.est pas disponible/i);
  await desktop.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await mobile.newPage();
  await page.goto(baseURL, { waitUntil: "networkidle" });
  assert(await page.getByRole("button", { name: "Brief", exact: true }).isVisible());
  assert(await page.getByRole("button", { name: "Partition", exact: true }).isVisible());
  assert(await page.getByRole("button", { name: "App", exact: true }).isVisible());

  await page.getByRole("button", { name: "Partition", exact: true }).click();
  await page.getByText("Tout commence par un brief.").waitFor();
  await page.getByRole("button", { name: "App", exact: true }).click();
  await page.getByText("Le studio, depuis ton écran d’accueil.").waitFor();

  await page.evaluate((item) => {
    localStorage.setItem("architecte-sonore-history", JSON.stringify([item]));
  }, historyItem);
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Ouvrir l’historique, 1 composition/ }).click();
  await page.getByText("La dalle tient debout", { exact: true }).first().waitFor();
  await page.getByRole("button", { name: "Restaurer" }).click();
  await page.getByRole("heading", { name: "La dalle tient debout" }).waitFor();
  await page.locator("summary").filter({ hasText: "Arrangement" }).waitFor();

  const copyChecks = [
    ["Copier Style of Music", sampleScore.styleOfMusic],
    ["Copier Exclude Styles", sampleScore.excludeStyles],
    ["Copier Lyrics", sampleScore.lyrics],
  ];
  for (const [buttonName, expected] of copyChecks) {
    await page.getByRole("button", { name: buttonName }).click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    assert.equal(clipboard, expected);
  }

  const manifest = await page.request.get(`${baseURL}/manifest.webmanifest`);
  assert.equal(manifest.status(), 200);
  assert.equal((await manifest.json()).short_name, "Architecte");
  if (process.env.EXPECT_SW === "1") {
    const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
    assert.match(scope, /\/$/);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: "/tmp/architecte-mobile-score.png" });
  await mobile.close();

  console.log("Smoke test passed: preset, server error state, mobile tabs, localStorage history, 3 copies, PWA manifest.");
} finally {
  await browser.close();
}
