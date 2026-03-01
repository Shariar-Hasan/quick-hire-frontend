import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <aside className="w-60 border-r p-4 flex flex-col gap-2">
        <Link href="/dashboard">Overview</Link>
        <Link href="/dashboard/my-jobs">My Jobs</Link>
        <Link href="/dashboard/applications">Applications</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/jobs/post">Post a Job</Link>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
