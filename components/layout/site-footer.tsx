import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { getOfficeDetails, getPracticeAreasForPage } from "@/lib/server-data";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Practice Areas" },
  { href: "/contact", label: "Contact" },
];

export async function SiteFooter() {
  const [officeDetails, practiceAreas] = await Promise.all([
    getOfficeDetails(),
    getPracticeAreasForPage(),
  ]);

  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-brand-link">
              <LogoMark size="md" className="footer-logo" />
            </Link>
            <p>
              Strategic, carefully managed representation across private,
              commercial, property, dispute, and mineral-sector matters.
            </p>
          </div>

          <div>
            <h2 className="footer-heading">Contact</h2>
            <div className="footer-contact-stack">
              <span>{officeDetails.addressLine1}</span>
              <span>{officeDetails.addressLine2}</span>
              <span>{officeDetails.city}</span>
              <a href={`tel:${officeDetails.phone.replace(/\s+/g, "")}`}>{officeDetails.phone}</a>
              <a href={`mailto:${officeDetails.email}`}>{officeDetails.email}</a>
              <a href="https://www.kinsleylaw.com" target="_blank" rel="noreferrer">
                www.kinsleylaw.com
              </a>
            </div>
          </div>

          <div>
            <h2 className="footer-heading">Quick links</h2>
            <div className="footer-links">
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="footer-heading">Practice areas</h2>
            <div className="footer-links">
              {practiceAreas.map((practiceArea) => (
                <Link key={practiceArea.name} href="/services">
                  {practiceArea.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Kinsley Advocates. All rights reserved.</span>
          <span>Global Trading Center (GTC), Westlands, Nairobi.</span>
        </div>
      </div>
    </footer>
  );
}
