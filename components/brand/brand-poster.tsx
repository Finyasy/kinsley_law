type BrandPosterProps = {
  priority?: boolean;
  className?: string;
};

export function BrandPoster({ className = "" }: BrandPosterProps) {
  return (
    <div className={`brand-poster-shell ${className}`.trim()}>
      <div className="brand-poster-inner">
        <div className="brand-poster-frame">
          <span className="brand-poster-ka">KA</span>
        </div>
        <span className="brand-poster-wordmark">Kinsley Advocates</span>
      </div>
    </div>
  );
}
