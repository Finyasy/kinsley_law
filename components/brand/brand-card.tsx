type BrandCardProps = {
  priority?: boolean;
  className?: string;
};

export function BrandCard({ className = "" }: BrandCardProps) {
  return (
    <div className={`brand-card-shell ${className}`.trim()}>
      <div className="brand-card-inner">
        <div className="brand-card-lockup">
          <div className="brand-card-frame">
            <span className="brand-card-ka">KA</span>
          </div>
          <span className="brand-card-wordmark">Kinsley Advocates</span>
        </div>

        <div className="brand-card-details">
          <span>+254 704 561 831</span>
          <span>P.O. Box 18627-00100, Nairobi</span>
          <span>Global Trading Center (GTC)</span>
          <span>Westlands, 9th Floor, Suite D36</span>
          <span>kinsleyadvocates@gmail.com</span>
          <span>www.kinsleylaw.com</span>
        </div>
      </div>
    </div>
  );
}
