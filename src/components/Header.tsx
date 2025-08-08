import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center">
          🚨 TransAlert
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="#signaler" className="hover:underline">
                Signaler
              </Link>
            </li>
            <li>
              <Link href="#signalements" className="hover:underline">
                Signalements
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}