import Link from 'next/link';

export default function CloudFooter() {
  return (
    <footer className="cloud-footer">
      <p className="cloud-footer__text">
        <Link href="/">avsolem.com</Link> &middot; Cloud Storage
      </p>
    </footer>
  );
}
