import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="text-xl font-bold text-primary">Quick Hire</Link>
      <div className="flex items-center gap-6">
        <Link href="/jobs" className="hover:text-primary transition-colors">Jobs</Link>
        <Link href="/about" className="hover:text-primary transition-colors">About</Link>
        <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
        <Link href="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">Register</Link>
      </div>
    </nav>
  );
}
