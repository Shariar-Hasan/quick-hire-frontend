import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <h1 className="text-8xl font-extrabold text-primary">404</h1>
      <div className="mt-4 h-1 w-16 rounded-full bg-primary" />
      <h2 className="mt-6 text-2xl font-semibold text-foreground">
        Page Not Found
      </h2>
      <p className="mt-3 max-w-md text-gray-500">
        Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/jobs"
          className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/10 transition-colors"
        >
          Browse Jobs
        </Link>
      </div>
    </div>
  );
}
