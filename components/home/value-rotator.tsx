"use client";

import { useEffect, useState } from "react";

type ValueRotatorProps = {
  label: string;
  prefix: string;
  values: string[];
};

export function ValueRotator({ label, prefix, values }: ValueRotatorProps) {
  const activeValues = values.length > 0 ? values : ["Mastery"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % activeValues.length);
    }, 2400);

    return () => window.clearInterval(interval);
  }, [activeValues.length]);

  return (
    <div className="rotator-shell">
      <div className="rotator-line">
        <span className="eyebrow">{label}</span>
      </div>
      <h1>
        {prefix}
        <span className="rotator-chip"> {activeValues[index]}</span>
        <span className="rotator-accent">.</span>
      </h1>
    </div>
  );
}
