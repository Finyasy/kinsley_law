"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header">
      <div className={`site-container site-header-inner${mobileOpen ? " mobile-open" : ""}`}>
        <Link href="/" className="brand-mark" onClick={() => setMobileOpen(false)}>
          <Image
            src="/images/logo.jpg"
            alt="Kinsley Law Advocates logo"
            width={56}
            height={56}
            priority
          />
          <div className="brand-text">
            <strong>Kinsley Law Advocates</strong>
            <span>Legal counsel with confidence</span>
          </div>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMobileOpen((current) => !current)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <span />
        </button>

        <nav className="main-nav">
          {links.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link${isActive ? " active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <Link href="/contact" className="header-button" onClick={() => setMobileOpen(false)}>
            Book Consultation
          </Link>
        </div>
      </div>
    </header>
  );
}
