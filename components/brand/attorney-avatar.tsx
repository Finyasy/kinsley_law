type AttorneyAvatarProps = {
  name: string;
  role?: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AttorneyAvatar({ name, role }: AttorneyAvatarProps) {
  return (
    <div className="attorney-avatar-shell" aria-hidden="true">
      <div className="attorney-avatar-grid" />
      <div className="attorney-avatar-mark">
        <span>{getInitials(name)}</span>
        {role ? <small>{role}</small> : null}
      </div>
    </div>
  );
}
