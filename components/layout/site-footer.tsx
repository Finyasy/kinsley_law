import Image from "next/image";
import Link from "next/link";
import { getOfficeDetails, getPracticeAreasForPage } from "@/lib/server-data";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Practice Areas" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
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
            <Link href="/" className="brand-mark">
              <Image
                src="/images/logo.jpg"
                alt="Kinsley Law Advocates logo"
                width={60}
                height={60}
              />
              <div className="brand-text">
                <strong>Kinsley Law Advocates</strong>
                <span>Excellence in legal representation</span>
              </div>
            </Link>
            <p>
              A modern legal practice offering thoughtful counsel, strong
              preparation, and a premium client experience across personal and
              commercial matters.
            </p>
          </div>

          <div>
            <h2 className="footer-heading">Contact</h2>
            <div className="footer-contact-stack">
              <span>{officeDetails.addressLine1}</span>
              <span>{officeDetails.addressLine2}</span>
              <span>{officeDetails.city}</span>
              <span>{officeDetails.phone}</span>
              <span>{officeDetails.email}</span>
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
              {practiceAreas.slice(0, 4).map((practiceArea) => (
                <Link key={practiceArea.name} href="/services">
                  {practiceArea.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Kinsley Law Advocates. All rights reserved.</span>
          <span>Crafted for a cleaner, faster full-stack migration to Next.js.</span>
        </div>
      </div>
    </footer>
  );
}
