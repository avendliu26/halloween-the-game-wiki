import Link from "next/link";

// Condensed from the linked official FAQs; detailed comparisons remain below.
const editions = [
  { title: "Standard Edition", eyebrow: "$39.99 USD · Digital", facts: ["September 8, 2026", "PS5, Xbox Series X|S and PC", "Base game"], href: "#standard-versus-digital-deluxe", action: "Compare digital editions" },
  { title: "Digital Deluxe Edition", eyebrow: "$59.99 USD · Digital", facts: ["Eligible pre-orders: September 4, 9 AM PT", "Two exclusive Civilians + Inmate Myers skin", "See the full list of contents and conditions below"], href: "#which-benefits-depend-on-pre-ordering", action: "Check early-access conditions" },
  { title: "Physical / Collector Edition", eyebrow: "$39.99 / $149.99 USD", facts: ["October 6, 2026", "PS5 and Xbox Series X disc editions", "Standard and limited Collector packages differ"], href: "/physical-editions", action: "Compare physical packages" }
];
const platforms = [
  { title: "PS5", eyebrow: "PlayStation Store", facts: ["Digital release: September 8, 2026", "PS Plus required for online play", "Check your regional store for availability"], href: "#ps5-online-play-and-controller-features", action: "PS5 details" },
  { title: "Xbox Series X|S", eyebrow: "Xbox Store", facts: ["Digital release: September 8, 2026", "Qualifying subscription required for online play", "Physical disc option: Series X only"], href: "#xbox-series-x-and-series-s", action: "Xbox details" },
  { title: "PC", eyebrow: "Steam + Epic Games Store", facts: ["Digital release: September 8, 2026", "Windows PC", "Check the published system requirements"], href: "#pc-steam-versus-epic", action: "PC storefront details" }
];

export function PageSummaryCards({ slug }: { slug: string }) {
  const cards = slug === "editions" ? editions : slug === "platforms" ? platforms : undefined;
  if (!cards) return null;
  return <section className="page-summary" aria-label={slug === "editions" ? "Edition summary" : "Platform summary"}>
    <div className="page-summary__grid">
      {cards.map((card) => <div className="page-summary-card" key={card.title}>
        <p className="preview-card__eyebrow">{card.eyebrow}</p>
        <p className="page-summary-card__title">{card.title}</p>
        <ul>{card.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
        <Link href={card.href}>{card.action}</Link>
      </div>)}
    </div>
    <p className="page-summary__note">{slug === "editions" ? <>Announced US prices; local pricing varies. <a href="https://halloweengame.com/news/preorder/" target="_blank" rel="noopener noreferrer">Digital FAQ</a> · <a href="https://halloweengame.com/news/physical-editions/" target="_blank" rel="noopener noreferrer">Physical FAQ</a>.</> : <>Launch details vary by region. The full crossplay matchmaking matrix and cross-progression rules are not officially confirmed; <a href="#what-the-cross-platform-badges-confirm">see the storefront evidence below</a>.</>}</p>
  </section>;
}
