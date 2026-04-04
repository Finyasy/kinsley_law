"use client";

import { useEffect, useState } from "react";

type ValueRotatorProps = {
  label?: string;
  primaryText?: string;
  staticText?: string;
  values: string[];
};

export function ValueRotator({
  label,
  primaryText = "Excellence",
  staticText = "In Law",
  values,
}: ValueRotatorProps) {
  const activeValues = values.length > 0 ? values : ["Mastery"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % activeValues.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [activeValues.length]);

  return (
    <div className="rotator-shell">
      {label ? <span className="eyebrow">{label}</span> : null}
      <div className="rotator-title-block" aria-live="polite">
        <h1 className="rotator-title-primary">
          {primaryText}
          <span className="rotator-accent">.</span>
        </h1>
        <div className="rotator-title-secondary">
          <span className="rotator-static">{staticText}</span>
          <span key={activeValues[index]} className="rotator-word">
            {activeValues[index]}
          </span>
        </div>
      </div>
    </div>
  );
}
