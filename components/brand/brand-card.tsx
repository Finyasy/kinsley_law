import Image from "next/image";

type BrandCardProps = {
  priority?: boolean;
  className?: string;
};

export function BrandCard({ priority = false, className = "" }: BrandCardProps) {
  return (
    <div className={`brand-card-shell ${className}`.trim()}>
      <Image
        src="/images/brand-card.jpg"
        alt="Kinsley Advocates brand card with logo and office details"
        width={1079}
        height={427}
        className="brand-card-image"
        priority={priority}
      />
    </div>
  );
}
