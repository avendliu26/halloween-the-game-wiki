import Link from "next/link";
import { gameConfig } from "@/config/game";

export default function NotFound() {
  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <p className="preview-card__eyebrow">Lost in the archive</p>
      <h1 id="not-found-title">Page not found</h1>
      <p>The page you were looking for is unavailable. Continue exploring {gameConfig.wikiName} from one of these starting points.</p>
      <nav aria-label="Helpful links" className="not-found-page__links">
        <Link className="button button--primary" href="/">Home</Link>
        <Link className="button button--secondary" href="/guides">Guides</Link>
        <Link className="button button--secondary" href="/game-info">Game Info</Link>
      </nav>
    </section>
  );
}
