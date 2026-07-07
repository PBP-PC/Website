import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QualityLand Level Rechner" },
      { name: "description", content: "Berechne dein QualityLand-Level basierend auf Beruf, Bildung, Konsum und sozialem Status." },
      { property: "og:title", content: "QualityLand Level Rechner" },
      { property: "og:description", content: "Finde heraus, welches Level du in QualityLand hättest." },
    ],
  }),
  component: Index,
});

type Field = {
  key: string;
  label: string;
  options: { label: string; value: number }[];
};

const fields: Field[] = [
  {
    key: "job",
    label: "Beruf",
    options: [
      { label: "Nutzloser (arbeitslos)", value: 5 },
      { label: "Dienstleister / Handwerker", value: 25 },
      { label: "Angestellter im Mittelbau", value: 45 },
      { label: "Kreativer / Akademiker", value: 65 },
      { label: "Manager / Ingenieur", value: 80 },
      { label: "TheShop-Vorstand / Politiker", value: 99 },
    ],
  },
  {
    key: "education",
    label: "Bildung",
    options: [
      { label: "Kein Abschluss", value: 5 },
      { label: "Grundausbildung", value: 25 },
      { label: "Berufsausbildung", value: 45 },
      { label: "Universitätsabschluss", value: 65 },
      { label: "Doktortitel", value: 85 },
    ],
  },
  {
    key: "consumption",
    label: "Konsumverhalten (TheShop-Bestellungen/Monat)",
    options: [
      { label: "0–2", value: 10 },
      { label: "3–10", value: 30 },
      { label: "11–25", value: 55 },
      { label: "26–50", value: 75 },
      { label: "50+", value: 95 },
    ],
  },
  {
    key: "social",
    label: "Soziale Bewertungen (Likes im Schnitt)",
    options: [
      { label: "Kaum jemand kennt mich", value: 10 },
      { label: "Kleiner Freundeskreis", value: 30 },
      { label: "Beliebt in der Nachbarschaft", value: 55 },
      { label: "Lokale Berühmtheit", value: 75 },
      { label: "Influencer-Status", value: 95 },
    ],
  },
  {
    key: "debt",
    label: "Finanzieller Status",
    options: [
      { label: "Hoch verschuldet", value: 5 },
      { label: "Leicht im Minus", value: 25 },
      { label: "Ausgeglichen", value: 50 },
      { label: "Solides Vermögen", value: 75 },
      { label: "Reich wie Henryk Ingenieur", value: 99 },
    ],
  },
  {
    key: "compliance",
    label: "Wie sehr vertraust du dem System?",
    options: [
      { label: "Ich bin Widerstand", value: 5 },
      { label: "Skeptisch", value: 25 },
      { label: "Neutral", value: 50 },
      { label: "Loyal", value: 75 },
      { label: "QualityPartei bis in den Tod", value: 99 },
    ],
  },
];

function levelInfo(level: number) {
  if (level >= 90) return { rank: "Level 90+", title: "Nützlicher der Extraklasse", desc: "Du bekommst die besten Produkte, bevor du sie überhaupt bestellst. TheShop liebt dich." };
  if (level >= 75) return { rank: "Level 75–89", title: "Sehr Nützlicher", desc: "Erste Klasse im Hyperloop, personalisierte Werbung mit echten Menschen." };
  if (level >= 50) return { rank: "Level 50–74", title: "Nützlicher", desc: "Solide Bürger:in. Keine Sonderrechte, aber auch keine Sorgen." };
  if (level >= 25) return { rank: "Level 25–49", title: "Weniger Nützlicher", desc: "Du bekommst B-Ware, aufdringliche Werbung und lange Warteschlangen." };
  if (level >= 10) return { rank: "Level 10–24", title: "Nutzloser", desc: "TheShop schickt dir, was sonst niemand will. Peter Arbeitsloser lässt grüßen." };
  return { rank: "Level 1–9", title: "Absolut Nutzloser", desc: "Willkommen im untersten Level. Kalorienarmes Restaurant und keine Zukunft." };
}

function Index() {
  const [answers, setAnswers] = useState<Record<string, number | null>>(
    Object.fromEntries(fields.map((f) => [f.key, null])),
  );
  const [submitted, setSubmitted] = useState(false);

  const level = useMemo(() => {
    const values = Object.values(answers).filter((v): v is number => v !== null);
    if (values.length === 0) return 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.round(avg);
  }, [answers]);

  const allAnswered = Object.values(answers).every((v) => v !== null);
  const info = levelInfo(level);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12 text-center">
          <div className="mb-3 inline-block rounded-full border border-border px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
            QualityLand — offiziell inoffiziell
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Dein Level-Rechner
          </h1>
          <p className="mt-4 text-muted-foreground">
            Beantworte ein paar Fragen und finde heraus, welches Level dir das System zuweisen würde.
          </p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-8"
        >
          {fields.map((f) => (
            <fieldset key={f.key} className="rounded-xl border border-border bg-card p-5">
              <legend className="px-2 text-sm font-medium">{f.label}</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {f.options.map((opt) => {
                  const active = answers[f.key] === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.label}
                      onClick={() =>
                        setAnswers((a) => ({ ...a, [f.key]: opt.value }))
                      }
                      className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-accent"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <button
            type="submit"
            disabled={!allAnswered}
            className="w-full rounded-lg bg-primary px-6 py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Level berechnen
          </button>
        </form>

        {submitted && allAnswered && (
          <section className="mt-12 rounded-2xl border border-border bg-card p-8 text-center">
            <div className="text-sm uppercase tracking-widest text-muted-foreground">
              Dein QualityLand-Level
            </div>
            <div className="my-4 text-7xl font-bold tabular-nums">{level}</div>
            <div className="text-lg font-semibold">{info.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{info.rank}</div>
            <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
              {info.desc}
            </p>
          </section>
        )}

        <footer className="mt-16 text-center text-xs text-muted-foreground">
          Inspiriert von „QualityLand" von Marc-Uwe Kling. Kein offizielles Produkt von TheShop.
        </footer>
      </div>
    </div>
  );
}
