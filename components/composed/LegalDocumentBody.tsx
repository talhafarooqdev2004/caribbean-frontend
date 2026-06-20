"use client";

import styles from "./LegalDocumentBody.module.scss";

import React from "react";
import { clsx } from "clsx";
import { Lock, Shield } from "lucide-react";
import { Container } from "../layout";

export type LegalBlock =
  | { type: "lead"; text: string }
  | { type: "subheading"; text: string; dash: "gold" | "navy" | "teal" }
  | { type: "list"; items: string[] }
  | { type: "callout"; tone: "teal" | "cream" | "gold"; icon?: "shield" | "lock"; content: React.ReactNode };

export type LegalSection = {
  number: string;
  id: string;
  tocLabel: string;
  title: React.ReactNode;
  blocks: LegalBlock[];
};

type LegalDocumentBodyProps = {
  sections: LegalSection[];
  accent: "teal" | "gold";
};

function CalloutIcon({ icon }: { icon: "shield" | "lock" }) {
  const Icon = icon === "shield" ? Shield : Lock;
  return (
    <span className={styles.calloutIcon}>
      <Icon size={16} strokeWidth={1.8} />
    </span>
  );
}

function BlockView({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "lead":
      return <p className={styles.lead}>{block.text}</p>;
    case "subheading": {
      const dashClass = { gold: styles.dashGold, navy: styles.dashNavy, teal: styles.dashTeal }[block.dash];
      return <h3 className={clsx(styles.subheading, dashClass)}>{block.text}</h3>;
    }
    case "list":
      return (
        <ul className={styles.bulletList}>
          {block.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      );
    case "callout": {
      const toneClass = { teal: styles.calloutTeal, cream: styles.calloutCream, gold: styles.calloutGold }[block.tone];
      return (
        <div className={clsx(styles.callout, toneClass)}>
          {block.icon && <CalloutIcon icon={block.icon} />}
          <p>{block.content}</p>
        </div>
      );
    }
  }
}

export default function LegalDocumentBody({ sections, accent }: LegalDocumentBodyProps) {
  const [activeId, setActiveId] = React.useState(sections[0]?.id ?? "");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  React.useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");

    if (!hash) {
      return;
    }

    const el = document.getElementById(hash);

    if (!el) {
      return;
    }

    window.setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(hash);
    }, 80);
  }, [sections]);

  function scrollToSection(event: React.MouseEvent, id: string) {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className={clsx(styles.contentSection, accent === "gold" ? styles.accentGold : styles.accentTeal)}>
      <div className={styles.curve} aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,48 C1300,52 1180,66 1040,66 C900,66 820,44 680,40 C540,36 460,64 320,64 C200,64 120,54 0,42 Z" />
        </svg>
      </div>

      <Container className={styles.inner}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSticky}>
            <span className={styles.eyebrow}>Contents</span>

            <ul className={styles.toc}>
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={clsx(styles.tocLink, activeId === section.id && styles.tocActive)}
                    onClick={(event) => scrollToSection(event, section.id)}
                  >
                    <span className={styles.tocNumber}>{section.number}</span>
                    {section.tocLabel}
                  </a>
                </li>
              ))}
            </ul>

            <button type="button" className={styles.backToTop} onClick={scrollToTop}>
              <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.49502 10.2818V2.70581M10.283 6.4938L6.49502 2.70581L2.70703 6.4938" stroke="#6B849A" strokeWidth="1.08228" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to top
            </button>
          </div>
        </aside>

        <div className={styles.content}>
          {sections.map((section) => (
            <article key={section.id} id={section.id} className={styles.sectionBlock}>
              <span className={styles.sectionEyebrow}>{section.number}</span>
              <h2 className={styles.title}>{section.title}</h2>

              {section.blocks.map((block, index) => (
                <BlockView key={index} block={block} />
              ))}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
