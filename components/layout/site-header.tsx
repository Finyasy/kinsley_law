"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/brand/logo-mark";

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
          <LogoMark size="sm" priority />
          <div className="brand-text">
            <strong>Kinsley Advocates</strong>
            <span>Strategic attorneys with calm authority</span>
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
            Request Consultation
          </Link>
        </div>
      </div>
    </header>
  );
}
