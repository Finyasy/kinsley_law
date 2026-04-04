import Image from "next/image";

type BrandPosterProps = {
  priority?: boolean;
  className?: string;
};

export function BrandPoster({ priority = false, className = "" }: BrandPosterProps) {
  return (
    <div className={`brand-poster-shell ${className}`.trim()}>
      <Image
        src="/images/kins_law.jpg"
        alt="Kinsley Advocates brand poster"
        width={576}
        height={1024}
        priority={priority}
        className="brand-poster-image"
      />
    </div>
  );
}
