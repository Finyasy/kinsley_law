"use client";

import { useState } from "react";

type AttorneyAvatarProps = {
  name: string;
  role?: string;
  photoUrl?: string | null;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AttorneyAvatar({ name, role, photoUrl }: AttorneyAvatarProps) {
  const [failedPhotoUrl, setFailedPhotoUrl] = useState<string | null>(null);
  const shouldRenderPhoto = Boolean(photoUrl) && failedPhotoUrl !== photoUrl;

  return (
    <div className="attorney-avatar-shell" aria-hidden="true">
      {shouldRenderPhoto ? (
        <>
          {/* Raw img keeps arbitrary admin-supplied URLs working without a domain allowlist. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl ?? undefined}
            alt=""
            className="attorney-avatar-photo"
            loading="lazy"
            onError={() => setFailedPhotoUrl(photoUrl ?? null)}
          />
          <div className="attorney-avatar-photo-overlay" />
        </>
      ) : (
        <>
          <div className="attorney-avatar-grid" />
          <div className="attorney-avatar-mark">
            <span>{getInitials(name)}</span>
            {role ? <small>{role}</small> : null}
          </div>
        </>
      )}
    </div>
  );
}
