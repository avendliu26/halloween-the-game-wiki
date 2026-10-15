import { TopicIcon } from "@/components/home/topic-icon";

/** Plain anchors keep the learning paths available before hydration. */
export function MatchStart() {
  return (
    <section className="match-start" aria-labelledby="match-start-title">
      <div className="match-start__intro">
        <div>
          <p className="preview-card__eyebrow">Your first match</p>
          <h2 id="match-start-title">One town. Two ways to play.</h2>
          <p>Learn the match basics, then jump to the steps for your role.</p>
        </div>
        <a className="match-start__basics" href="#quick-answer">Start with the basics <span aria-hidden="true">↓</span></a>
      </div>
      <nav className="role-entry" aria-label="Jump to your role">
        <a href="#playing-as-a-civilian">
          <TopicIcon name="Characters" />
          <span>
            <small>THE SURVIVORS · 4 PLAYERS</small>
            <strong>Play as a Civilian</strong>
            <span>Find residents. Call for help. Prepare an escape.</span>
            <span className="role-entry__action">Follow the survival steps <span aria-hidden="true">↓</span></span>
          </span>
        </a>
        <a href="#playing-as-michael-myers">
          <TopicIcon name="Michael Myers" />
          <span>
            <small>THE HUNTER · 1 PLAYER</small>
            <strong>Play as Michael Myers</strong>
            <span>Locate victims. Build Stalk. Pressure the town.</span>
            <span className="role-entry__action">Follow the hunting steps <span aria-hidden="true">↓</span></span>
          </span>
        </a>
      </nav>
      <nav className="match-start__shortcuts" aria-label="First match help">
        <span>Need a quick answer?</span>
        <a href="#objectives-escapes-and-winning">Match objectives</a>
        <a href="#death-skill-checks-and-police-reinforcements">After you die</a>
        <a href="#beginner-mistakes">Mistakes to avoid</a>
        <a href="#common-questions">Common questions</a>
      </nav>
    </section>
  );
}
