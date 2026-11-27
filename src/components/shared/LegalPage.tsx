import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalPageProps = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export default function LegalPage({
  title,
  updated,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: {updated}
      </p>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        {intro}
      </p>

      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-heading text-2xl font-semibold">
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {(section.paragraphs || []).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="list-disc space-y-2 pl-6">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border bg-card p-6 sm:p-8">
        <h2 className="font-heading text-xl font-semibold">Questions?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Reach out before using the service if anything here is unclear.
        </p>
        <ul className="mt-5 space-y-3 text-sm">
          <li className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-accent" />
            <a
              href="mailto:support@mentorlagbe.com"
              className="font-medium hover:text-accent"
            >
              support@mentorlagbe.com
            </a>
          </li>
          <li className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-accent" />
            <a href="tel:01747740061" className="font-medium hover:text-accent">
              01747740061
            </a>
          </li>
          <li className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="font-medium">Jamalpur, Bangladesh</span>
          </li>
        </ul>
        <Link
          href="/pricing"
          className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
        >
          View pricing →
        </Link>
      </div>
    </article>
  );
}
