import { Briefcase, Building2, FileText, LayoutDashboard, MapPin, PlusCircle, Tag, Users } from "lucide-react";

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
        title: "Applications",
        href: "/dashboard/applications",
        icon: FileText,
    },
    {
        title: "Companies",
        href: "/dashboard/companies",
        icon: Building2,
    },
    {
        title: "Locations",
        href: "/dashboard/locations",
        icon: MapPin,
    },
    {
        title: "Categories",
        href: "/dashboard/categories",
        icon: Tag,
    },
    {
        title: "Users",
        href: "/dashboard/users",
        icon: Users,
    },
];