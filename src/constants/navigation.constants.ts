import { Briefcase, FileText, LayoutDashboard, PlusCircle, UserCircle } from "lucide-react";

export const dashboard_nav_links = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "All Jobs",
        href: "/dashboard/jobs",
        icon: Briefcase,
    },
    {
        title: "Post a Job",
        href: "/dashboard/jobs/post",
        icon: PlusCircle,
    },
    {
        title: "All Applications",
        href: "/dashboard/applications",
        icon: FileText,
    },
];