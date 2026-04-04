import Image from "next/image";

type LogoMarkProps = {
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  className?: string;
};

const dimensions = {
  sm: { width: 150, height: 100 },
  md: { width: 240, height: 160 },
  lg: { width: 360, height: 240 },
};

export function LogoMark({
  size = "md",
  priority = false,
  className = "",
}: LogoMarkProps) {
  const { width, height } = dimensions[size];

  return (
    <div className={`logo-mark-shell logo-mark-${size} ${className}`.trim()}>
      <Image
        src="/images/kinsley-logo-new.png"
        alt="Kinsley Advocates logo"
        width={width}
        height={height}
        priority={priority}
        className="logo-mark-image"
      />
    </div>
  );
}
