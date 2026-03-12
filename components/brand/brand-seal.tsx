import Image from "next/image";

type BrandSealProps = {
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  className?: string;
};

const dimensions = {
  sm: 88,
  md: 220,
  lg: 440,
};

export function BrandSeal({
  size = "md",
  priority = false,
  className = "",
}: BrandSealProps) {
  const dimension = dimensions[size];

  return (
    <div className={`brand-seal-shell brand-seal-${size} ${className}`.trim()}>
      <div className="brand-seal-ring" />
      <div className="brand-seal-card">
        <Image
          src="/images/logo.jpg"
          alt="Kinsley Law Advocates seal"
          width={dimension}
          height={dimension}
          className="brand-seal-image"
          priority={priority}
        />
      </div>
    </div>
  );
}
