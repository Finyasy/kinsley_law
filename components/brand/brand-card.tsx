import {
  FIRM_CONTACT_EMAIL,
  FIRM_CONTACT_PHONE,
  FIRM_WEBSITE_LABEL,
} from "@/lib/firm-contact";

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
          <span>{FIRM_CONTACT_PHONE}</span>
          <span>P.O. Box 18627-00100, Nairobi</span>
          <span>Global Trading Center (GTC)</span>
          <span>Westlands, 9th Floor, Suite D36</span>
          <span>{FIRM_CONTACT_EMAIL}</span>
          <span>{FIRM_WEBSITE_LABEL}</span>
        </div>
      </div>
    </div>
  );
}
