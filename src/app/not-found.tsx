import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center py-32 gap-6 text-center w-full">
      <span className="text-6xl font-bold text-gray-900 dark:text-white">
        404
      </span>
      <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
        Page Not Found
      </h1>
      <p className="text-gray-500 dark:text-gray-400">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="
          px-4 py-2 rounded-lg font-medium
          bg-cyan-600 hover:bg-cyan-700 text-white
          dark:bg-cyan-500 dark:hover:bg-cyan-600
          transition-colors duration-200
        "
      >
        Go Home
      </Link>
    </section>
  );
}
