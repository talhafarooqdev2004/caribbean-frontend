import styles from "./LegalDocumentContent.module.scss";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Container } from "../layout";

export type LegalDocumentCardTone = "default" | "info" | "warning" | "danger";

export type LegalDocumentCard = {
  title?: string;
  content?: ReactNode;
  items?: string[];
  footer?: ReactNode;
  tone?: LegalDocumentCardTone;
};

export type LegalDocumentSection = {
  id: string;
  number: number;
  title: string;
  icon?: LucideIcon;
  lead?: ReactNode;
  cards: LegalDocumentCard[];
  inlineTitleCard?: boolean;
};

type LegalDocumentContentProps = {
  intro: ReactNode;
  sections: LegalDocumentSection[];
};

export default function LegalDocumentContent({
  intro,
  sections,
}: LegalDocumentContentProps) {
  return (
    <section className={styles.legalDocumentContent}>
      <Container className={styles.legalDocumentContentInner}>
        <div className={styles.introNote}>
          {typeof intro === "string" ? <p>{intro}</p> : intro}
        </div>

        <div className={styles.sections}>
          {sections.map((section) => (
            <LegalDocumentContentSection key={section.id} section={section} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function LegalDocumentContentSection({
  section,
}: {
  section: LegalDocumentSection;
}) {
  if (section.inlineTitleCard) {
    return (
      <section id={section.id} className={styles.section}>
        {section.cards.map((card, index) => (
          <LegalDocumentContentCard
            key={`${section.id}-${index}`}
            number={section.number}
            title={section.title}
            inlineTitle
            card={card}
          />
        ))}
      </section>
    );
  }

  const Icon = section.icon;

  return (
    <section id={section.id} className={styles.section}>
      <div className={styles.sectionHeading}>
        {Icon ? (
          <div className={styles.sectionIconWrapper}>
            <Icon size={20} strokeWidth={1.9} />
          </div>
        ) : null}

        <h2>
          {section.number}. {section.title}
        </h2>
      </div>

      {section.lead ? (
        <div className={styles.sectionLead}>
          {typeof section.lead === "string" ? (
            <p>{section.lead}</p>
          ) : (
            section.lead
          )}
        </div>
      ) : null}

      <div className={styles.cards}>
        {section.cards.map((card, index) => (
          <LegalDocumentContentCard
            key={`${section.id}-${index}`}
            card={card}
          />
        ))}
      </div>
    </section>
  );
}

function LegalDocumentContentCard({
  card,
  inlineTitle = false,
  number,
  title,
}: {
  card: LegalDocumentCard;
  inlineTitle?: boolean;
  number?: number;
  title?: string;
}) {
  const toneClassName = {
    default: styles.cardDefault,
    info: styles.cardInfo,
    warning: styles.cardWarning,
    danger: styles.cardDanger,
  }[card.tone ?? "default"];

  const showMargin = inlineTitle || title || card.title || card.content;
  const showMarginOfContent = inlineTitle || card.title;

  return (
    <article className={`${styles.card} ${toneClassName}`}>
      {inlineTitle && number && title ? (
        <h2 className={styles.inlineTitle}>
          {number}. {title}
        </h2>
      ) : null}

      {card.title ? <h3>{card.title}</h3> : null}

      {card.content ? (
        <div
          className={`${styles.cardContent} ${typeof card.content !== "string" && card.title ? styles.marginTop8 : ""}`}
        >
          {typeof card.content === "string" ? (
            <p className={`${showMarginOfContent ? styles.marginTop8 : ""}`}>
              {card.content}
            </p>
          ) : (
            card.content
          )}
        </div>
      ) : null}

      {card.items?.length ? (
        <ul
          className={`${styles.cardList} ${showMargin ? styles.marginTop14 : ""}`}
        >
          {card.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {card.footer ? (
        <div className={styles.cardFooter}>
          {typeof card.footer === "string" ? <p>{card.footer}</p> : card.footer}
        </div>
      ) : null}
    </article>
  );
}
