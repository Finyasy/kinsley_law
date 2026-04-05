import { KAMonogram } from "@/components/brand/ka-monogram";

type BrandPosterProps = {
  priority?: boolean;
  className?: string;
  treatment?: "clean" | "embossed" | "glow";
};

export function BrandPoster({ className = "", treatment = "glow" }: BrandPosterProps) {
  return (
    <div className={`brand-poster-shell brand-treatment-${treatment} ${className}`.trim()}>
      <div className="brand-poster-inner">
        <div className="brand-poster-frame">
          <KAMonogram className="brand-poster-ka" treatment={treatment} />
        </div>
        <span className="brand-poster-wordmark">Kinsley Advocates</span>
      </div>
    </div>
  );
}
