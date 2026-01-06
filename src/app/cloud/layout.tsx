import './cloud-theme.scss';

// Root layout for /cloud - just imports styles
// CloudAuthProvider is in (main)/layout.tsx for pages that need it
// Lite pages don't need it (they use cookie-based auth on server)
export default function CloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
