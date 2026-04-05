type KAMonogramProps = {
  className?: string;
  treatment?: "clean" | "embossed" | "glow";
};

const K_PATH =
  "M30 14H141V698H30V712H344V698H241V380H251L553 698H449V712H656V698H573L319 429L682 14H748V0H459V14H549L249 366H241V14H344V0H30Z";

const A_PATH =
  "M324 597 214 306H434ZM-1 14H87L357 730H381L653 14H742V0H434V14H545L440 292H208L103 14H214V0H-1Z";

export function KAMonogram({
  className = "",
  treatment = "clean",
}: KAMonogramProps) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={`ka-monogram ka-monogram-${treatment} ${className}`.trim()}
      aria-hidden="true"
    >
      <path
        d={K_PATH}
        className="ka-monogram-path"
        transform="translate(34 181) scale(0.17 -0.17)"
      />
      <path
        d={A_PATH}
        className="ka-monogram-path"
        transform="translate(106 182) scale(0.154 -0.154)"
      />
    </svg>
  );
}
