"use client";

import { useMemo, useState } from "react";

type Persona = "Experience Seeker" | "Value Maximizer" | "Balanced Explorer";

type Stage =
  | "intro"
  | "profile"
  | "baseline"
  | "staircase"
  | "reflection"
  | "summary";

type Choice = "tagpeak" | "discount";

type Decision = {
  round: number;
  discountOffered: number;
  choice: Choice;
  confidence: number;
  note?: string;
};

type Profile = {
  name: string;
  email: string;
  ageRange: string;
  shoppingStyle: Persona;
  experienceFrequency: string;
};

type Reflection = {
  switchingConfidence: string;
  favouriteExperience: string;
  finalThoughts: string;
};

type StaircaseState = {
  stage: Stage;
  profile: Profile;
  reflection: Reflection;
  baselinePreference: Choice | null;
  baselineReason: string;
  round: number;
  lowerBound: number;
  upperBound: number;
  currentDiscount: number;
  maxRounds: number;
  history: Decision[];
  isComplete: boolean;
};

const defaultProfile: Profile = {
  name: "",
  email: "",
  ageRange: "",
  shoppingStyle: "Balanced Explorer",
  experienceFrequency: ""
};

const defaultReflection: Reflection = {
  switchingConfidence: "",
  favouriteExperience: "",
  finalThoughts: ""
};

const personaCopy: Record<Persona, { title: string; description: string; color: string }> = {
  "Experience Seeker": {
    title: "Experience Seeker",
    description:
      "You love brands that surprise you with immersive drops and behind-the-scenes access.",
    color: "linear-gradient(135deg, #f97316, #ec4899)"
  },
  "Value Maximizer": {
    title: "Value Maximizer",
    description:
      "You watch the numbers closely and love stacking offers, but you're curious about experiential wins.",
    color: "linear-gradient(135deg, #0ea5e9, #6366f1)"
  },
  "Balanced Explorer": {
    title: "Balanced Explorer",
    description:
      "You mix practical savings with memorable perks to create rich shopping stories.",
    color: "linear-gradient(135deg, #22c55e, #a855f7)"
  }
};

const ageRanges = [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+"
];

const experienceFrequencies = [
  "Multiple times per week",
  "Once a week",
  "A few times per month",
  "A few times per year",
  "Rarely"
];

function roundToNearestFive(value: number) {
  return Math.max(1, Math.round(value / 5) * 5);
}

const MAX_DISCOUNT = 50;
const MIN_DISCOUNT = 1;

const initialState: StaircaseState = {
  stage: "intro",
  profile: defaultProfile,
  reflection: defaultReflection,
  baselinePreference: null,
  baselineReason: "",
  round: 1,
  lowerBound: MIN_DISCOUNT,
  upperBound: MAX_DISCOUNT,
  currentDiscount: 20,
  maxRounds: 6,
  history: [],
  isComplete: false
};

export function StaircaseSurvey() {
  const [state, setState] = useState<StaircaseState>(initialState);

  const progress = useMemo(() => {
    const stageOrder: Stage[] = [
      "intro",
      "profile",
      "baseline",
      "staircase",
      "reflection",
      "summary"
    ];
    const stageIndex = stageOrder.indexOf(state.stage);
    return Math.round(((stageIndex + (state.isComplete ? 1 : 0)) / stageOrder.length) * 100);
  }, [state.stage, state.isComplete]);

  const personaInsight = useMemo(() => personaCopy[state.profile.shoppingStyle], [state.profile]);

  const handleProfileChange = (field: keyof Profile, value: string) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const handleReflectionChange = (field: keyof Reflection, value: string) => {
    setState((prev) => ({
      ...prev,
      reflection: {
        ...prev.reflection,
        [field]: value
      }
    }));
  };

  const goToStage = (stage: Stage) => {
    setState((prev) => ({ ...prev, stage }));
  };

  const handleBaselineChoice = (choice: Choice) => {
    setState((prev) => ({
      ...prev,
      baselinePreference: choice,
      stage: "staircase"
    }));
  };

  const updateBaselineReason = (value: string) => {
    setState((prev) => ({
      ...prev,
      baselineReason: value
    }));
  };

  const moveToReflection = () => {
    setState((prev) => ({
      ...prev,
      stage: "reflection",
      isComplete: true
    }));
  };

  const handleStaircaseChoice = (choice: Choice, confidence: number, note: string) => {
    setState((prev) => {
      const nextHistory: Decision[] = [
        ...prev.history,
        {
          round: prev.round,
          discountOffered: prev.currentDiscount,
          choice,
          confidence,
          note
        }
      ];

      let nextLower = prev.lowerBound;
      let nextUpper = prev.upperBound;

      if (choice === "discount") {
        nextLower = Math.max(prev.currentDiscount, nextLower);
      } else {
        nextUpper = Math.min(prev.currentDiscount, nextUpper);
      }

      const midpoint = (nextLower + nextUpper) / 2;
      const nextDiscount = Math.min(
        MAX_DISCOUNT,
        Math.max(MIN_DISCOUNT, roundToNearestFive(midpoint))
      );

      const nextRound = prev.round + 1;
      const thresholdReached =
        nextRound > prev.maxRounds || Math.abs(nextUpper - nextLower) <= 2;

      return {
        ...prev,
        history: nextHistory,
        lowerBound: nextLower,
        upperBound: nextUpper,
        currentDiscount: thresholdReached ? nextDiscount : nextDiscount,
        round: nextRound,
        stage: thresholdReached ? "reflection" : prev.stage,
        isComplete: thresholdReached ? true : prev.isComplete
      };
    });
  };

  const restartSurvey = () => {
    setState(initialState);
  };

  const renderIntro = () => (
    <section className="card">
      <div className="floating-badge">New mechanism vs. discount</div>
      <h1>Discover your Tagpeak tipping point</h1>
      <p>
        This interactive journey maps the exact moment you would trade a classic discount for a
        Tagpeak experiential drop. We&apos;ll keep it short, adaptive, and insightful so you leave with a
        personal shopper profile.
      </p>
      <ul className="insight-list">
        <li>✨ 6 adaptive rounds using the staircase method</li>
        <li>🧠 Tailored insights on your shopping mindset</li>
        <li>🎯 A polished summary you can share with the team</li>
      </ul>
      <button className="primary" onClick={() => goToStage("profile")}>
        Start the experience
      </button>
    </section>
  );

  const renderProfile = () => (
    <section className="grid">
      <div className="card">
        <h2>Tell us about your shopping rhythm</h2>
        <p>
          We use this to tune the scenario to your context. Think of it as calibrating your personal
          Tagpeak radar.
        </p>
        <div className="form">
          <label>
            Preferred name
            <input
              type="text"
              value={state.profile.name}
              onChange={(event) => handleProfileChange("name", event.target.value)}
              placeholder="Alex"
            />
          </label>
          <label>
            Work email
            <input
              type="email"
              value={state.profile.email}
              onChange={(event) => handleProfileChange("email", event.target.value)}
              placeholder="alex@brand.com"
            />
          </label>
          <label>
            Age range
            <select
              value={state.profile.ageRange}
              onChange={(event) => handleProfileChange("ageRange", event.target.value)}
            >
              <option value="">Select one</option>
              {ageRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </label>
          <label>
            How often do you seek memorable brand experiences?
            <select
              value={state.profile.experienceFrequency}
              onChange={(event) => handleProfileChange("experienceFrequency", event.target.value)}
            >
              <option value="">Select one</option>
              {experienceFrequencies.map((frequency) => (
                <option key={frequency} value={frequency}>
                  {frequency}
                </option>
              ))}
            </select>
          </label>
          <div className="persona-selector">
            <span>What kind of shopper energy describes you best today?</span>
            <div className="persona-grid">
              {(Object.keys(personaCopy) as Persona[]).map((persona) => (
                <button
                  type="button"
                  key={persona}
                  className={`persona-card${
                    state.profile.shoppingStyle === persona ? " active" : ""
                  }`}
                  onClick={() => handleProfileChange("shoppingStyle", persona)}
                >
                  <strong>{personaCopy[persona].title}</strong>
                  <span>{personaCopy[persona].description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="actions">
          <button className="secondary" onClick={() => goToStage("intro")}>
            Back
          </button>
          <button
            className="primary"
            onClick={() => goToStage("baseline")}
            disabled={
              !state.profile.name || !state.profile.email || !state.profile.ageRange || !state.profile.experienceFrequency
            }
          >
            Continue
          </button>
        </div>
      </div>
      <aside className="card insight" style={{ background: personaInsight.color }}>
        <span className="eyebrow">Live insight</span>
        <h3>{personaInsight.title}</h3>
        <p>{personaInsight.description}</p>
        <p>
          Tip: Keep answering instinctively. The adaptive rounds learn from each choice to pin-point
          your Tagpeak tipping point.
        </p>
      </aside>
    </section>
  );

  const renderBaseline = () => (
    <section className="grid">
      <div className="card">
        <h2>Baseline challenge</h2>
        <p>
          Imagine your favourite brand launches a new product. You can either grab a straight
          <strong> 20% discount</strong> or access a Tagpeak experience: limited-edition packaging,
          live co-creation session, and a loyalty badge.
        </p>
        <div className="choices">
          <button className="primary" onClick={() => handleBaselineChoice("tagpeak")}>
            I&apos;d go Tagpeak first
          </button>
          <button className="ghost" onClick={() => handleBaselineChoice("discount")}>
            I&apos;d take the 20% off
          </button>
        </div>
        <label className="reason">
          What guided that instinct?
          <textarea
            rows={3}
            placeholder="Jot down the cues you noticed..."
            value={state.baselineReason}
            onChange={(event) => updateBaselineReason(event.target.value)}
          />
        </label>
        <div className="actions">
          <button className="secondary" onClick={() => goToStage("profile")}>
            Back
          </button>
        </div>
      </div>
      <aside className="card mini-insight">
        <h3>What happens next?</h3>
        <p>
          We take this gut-check as the starting point for our staircase rounds. Each choice will
          flex the next offer until we find your indifference point.
        </p>
      </aside>
    </section>
  );

  const renderStaircase = () => {
    const currentRound = state.history.length + 1;

    return (
      <section className="card">
        <div className="round-header">
          <span className="badge">Round {currentRound} of {state.maxRounds}</span>
          <span className="subtle">Adaptive offer based on your last response</span>
        </div>
        <h2>
          Trade-off: Would you swap a <span className="highlight">{state.currentDiscount}%</span>{" "}
          discount for the Tagpeak drop?
        </h2>
        <p className="scenario">
          Picture a Tagpeak activation with:
        </p>
        <ul className="scenario-list">
          <li>🎟️ Hands-on preview with the product team</li>
          <li>🤝 Passes to bring a friend</li>
          <li>🌐 Exclusive digital badge unlocking future perks</li>
        </ul>
        <div className="choices">
          <TradeoffButton
            key={`tagpeak-${state.history.length}`}
            label="Take the Tagpeak experience"
            onSelect={(confidence, note) => handleStaircaseChoice("tagpeak", confidence, note)}
            accent="tagpeak"
          />
          <TradeoffButton
            key={`discount-${state.history.length}`}
            label={`Keep the ${state.currentDiscount}% discount`}
            onSelect={(confidence, note) => handleStaircaseChoice("discount", confidence, note)}
            accent="discount"
          />
        </div>
        <div className="microcopy">
          <p>
            We&apos;ll nudge the next offer up or down to zero-in on the point where you&apos;d switch.
          </p>
          <p>
            Confidence scale: 1 = guessing, 5 = would stake the campaign on it.
          </p>
        </div>
      </section>
    );
  };

  const renderReflection = () => (
    <section className="grid">
      <div className="card">
        <h2>Lock in your takeaways</h2>
        <p>
          You just completed the staircase calibration. Tell us how confident you are in that
          switching point and what future Tagpeak moment you&apos;d love.
        </p>
        <div className="form">
          <label>
            How confident do you feel about the switching point we surfaced?
            <select
              value={state.reflection.switchingConfidence}
              onChange={(event) => handleReflectionChange("switchingConfidence", event.target.value)}
            >
              <option value="">Select one</option>
              <option value="Very confident">Very confident</option>
              <option value="Somewhat confident">Somewhat confident</option>
              <option value="Not confident yet">Not confident yet</option>
            </select>
          </label>
          <label>
            Dream Tagpeak moment you&apos;d launch tomorrow
            <textarea
              rows={3}
              value={state.reflection.favouriteExperience}
              onChange={(event) => handleReflectionChange("favouriteExperience", event.target.value)}
              placeholder="VIP studio tour, creator collab, community build..."
            />
          </label>
          <label>
            Any final thoughts for the Tagpeak team?
            <textarea
              rows={3}
              value={state.reflection.finalThoughts}
              onChange={(event) => handleReflectionChange("finalThoughts", event.target.value)}
              placeholder="We read every note carefully."
            />
          </label>
        </div>
        <div className="actions">
          <button className="secondary" onClick={() => goToStage("staircase")}
          >
            Back
          </button>
          <button className="primary" onClick={() => goToStage("summary")}
            disabled={!state.reflection.switchingConfidence}
          >
            See my insights
          </button>
        </div>
      </div>
      <aside className="card mini-insight">
        <h3>Quick recap</h3>
        <p>
          The staircase converged to a switching band between <strong>{state.lowerBound}%</strong> and
          <strong> {state.upperBound}%</strong> off.
        </p>
        <p>
          That&apos;s the zone where a Tagpeak drop must outshine a discount to win you over.
        </p>
      </aside>
    </section>
  );

  const midpoint = Math.round((state.lowerBound + state.upperBound) / 2);

  const renderSummary = () => (
    <section className="grid">
      <div className="card">
        <h2>Your Tagpeak decision fingerprint</h2>
        <p>
          Thanks, {state.profile.name || "there"}. Here&apos;s the signal we&apos;ll take back to the team.
        </p>
        <div className="summary-grid">
          <div>
            <span className="eyebrow">Switching band</span>
            <h3>{state.lowerBound}% – {state.upperBound}% off</h3>
            <p>
              Tagpeak should match or exceed the perceived value of a {midpoint}% discount to convert
              you reliably.
            </p>
          </div>
          <div>
            <span className="eyebrow">Dominant persona</span>
            <h3>{personaInsight.title}</h3>
            <p>{personaInsight.description}</p>
          </div>
          <div>
            <span className="eyebrow">Confidence check</span>
            <h3>{state.reflection.switchingConfidence || "Pending"}</h3>
            <p>{state.reflection.finalThoughts || "No extra notes—straight to testing!"}</p>
          </div>
        </div>
        <div className="history">
          <h4>How you responded</h4>
          <ol>
            {state.history.map((decision) => (
              <li key={decision.round}>
                Round {decision.round}: opted for {decision.choice === "tagpeak" ? "Tagpeak" : `${decision.discountOffered}% off`} ·
                confidence {decision.confidence}/5
                {decision.note ? ` · "${decision.note}"` : ""}
              </li>
            ))}
          </ol>
        </div>
        <div className="actions">
          <button className="secondary" onClick={restartSurvey}>
            Start again
          </button>
          <button className="primary" onClick={() => alert("Thanks! Export coming soon.")}>
            Export summary
          </button>
        </div>
      </div>
      <aside className="card mini-insight">
        <h3>What&apos;s next?</h3>
        <p>
          Plug this threshold into campaign planning. Design a Tagpeak drop that beats a
          {midpoint}% discount for people like you.
        </p>
        <p>
          We can aggregate results across respondents to build richer persona heatmaps.
        </p>
      </aside>
    </section>
  );

  return (
    <div className="shell">
      <header className="header">
        <div>
          <span className="brand">Tagpeak</span>
          <h1 className="headline">Decision Pulse Lab</h1>
        </div>
        <div className="progress">
          <span>{progress}% complete</span>
          <div className="progress-track">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>
      <main>
        {state.stage === "intro" && renderIntro()}
        {state.stage === "profile" && renderProfile()}
        {state.stage === "baseline" && renderBaseline()}
        {state.stage === "staircase" && renderStaircase()}
        {state.stage === "reflection" && renderReflection()}
        {state.stage === "summary" && renderSummary()}
      </main>
    </div>
  );
}

type TradeoffButtonProps = {
  label: string;
  accent: "tagpeak" | "discount";
  onSelect: (confidence: number, note: string) => void;
};

function TradeoffButton({ label, accent, onSelect }: TradeoffButtonProps) {
  const [confidence, setConfidence] = useState(3);
  const [note, setNote] = useState("");

  const accentClass = accent === "tagpeak" ? "accent-tagpeak" : "accent-discount";

  return (
    <div className={`tradeoff ${accentClass}`}>
      <h3>{label}</h3>
      <label>
        Confidence {confidence}/5
        <input
          type="range"
          min={1}
          max={5}
          value={confidence}
          onChange={(event) => setConfidence(Number(event.target.value))}
        />
      </label>
      <textarea
        rows={2}
        placeholder="Optional note"
        value={note}
        onChange={(event) => setNote(event.target.value)}
      />
      <button type="button" className="primary" onClick={() => onSelect(confidence, note)}>
        Choose this
      </button>
    </div>
  );
}
