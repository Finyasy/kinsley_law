import Image from "next/image";
import { KAMonogram } from "@/components/brand/ka-monogram";

type LogoMarkProps = {
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  className?: string;
  variant?: "full" | "monogram";
  treatment?: "clean" | "embossed" | "glow";
};

const dimensions = {
  sm: { width: 168, height: 98 },
  md: { width: 252, height: 147 },
  lg: { width: 360, height: 210 },
};

export function LogoMark({
  size = "md",
  priority = false,
  className = "",
  variant = "full",
  treatment = "clean",
}: LogoMarkProps) {
  const { width, height } = dimensions[size];

  if (variant === "monogram") {
    return (
      <div
        className={`logo-mark-shell logo-mark-${size} logo-mark-monogram-shell logo-treatment-${treatment} ${className}`.trim()}
      >
        <div className="logo-mark-monogram-frame">
          <KAMonogram className="logo-mark-monogram" treatment={treatment} />
        </div>
      </div>
    );
  }

  return (
    <div className={`logo-mark-shell logo-mark-${size} ${className}`.trim()}>
      <Image
        src="/images/kinsley-logo-clean.svg"
        alt="Kinsley Advocates logo"
        width={width}
        height={height}
        priority={priority}
        className="logo-mark-image"
        sizes={
          size === "sm"
            ? "168px"
            : size === "md"
              ? "252px"
              : "360px"
        }
      />
    </div>
  );
}
