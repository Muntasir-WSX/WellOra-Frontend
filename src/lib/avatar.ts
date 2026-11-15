export function getProfileAvatar(user?: {
  profilePhoto?: string | null;
  imageUrl?: string | null;
  name?: string | null;
  email?: string | null;
  doctor?: { profilePhoto?: string | null } | null;
}) {
 
  const uploaded =
    user?.profilePhoto ||
    user?.doctor?.profilePhoto ||
    user?.imageUrl;

  if (uploaded) return uploaded;
  
  const label = user?.name || user?.email || "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    label,
  )}&background=10b981&color=ffffff&bold=true`;
}