type BuildUrlOptions = {
    params?: Record<string, string | number>;
    query?: { modal?: Record<string, any> } & Record<string, any>;
};
export type RoutesMapKey = keyof typeof routes

const routes = {
    "/": "/",
    "/login": "/login",
    "/logout": "/logout",
    "/register": "/register",
    "contact": "/contact",
    "about": "/about",

    "/jobs": "/jobs",
    "/jobs/:id": "/jobs/:id",
    "/jobs/:id/apply": "/jobs/:id/apply",
    "/companies": "/companies",

    // Dashboard routes
    "/dashboard": "/dashboard",
    "/dashboard/profile": "/dashboard/profile",
    "/dashboard/jobs": "/dashboard/jobs",
    "/dashboard/jobs/:id": "/dashboard/jobs/:id",
    "/dashboard/jobs/post": "/dashboard/jobs/post",
    "/dashboard/applications": "/dashboard/applications",

}

/**
 * Build a URL string from a predefined route or raw path, with support for:
 * - Dynamic path parameters (e.g. `:id` → `/dashboard/subjects/123`)
 * - Query parameters (flat, nested, or arrays)
 * - Nested query objects using bracket notation (`modal[type]=info`)
 *
 * @param route - Either a key from the `routes` map or a raw path string.
 * @param options - Optional params and query configuration.
 * @param options.params - Path parameters to replace placeholders like `:id`.
 * @param options.query - Query string parameters. Supports nested objects.
 *
 * @returns The fully built URL string.
 *
 * @example
 * // Example 1: Simple route with param replacement
 * createRoute("/dashboard/academics/classes/:id", {
 *   params: { id: 42 },
 * });
 * // → "/dashboard/academics/classes/42"
 *
 * @example
 * // Example 2: Adding flat query parameters
 * createRoute("/dashboard/students", {
 *   query: { page: 2, sort: "asc" },
 * });
 * // → "/dashboard/students?page=2&sort=asc"
 *
 * @example
 * // Example 3: Nested query objects (modal[type], modal[mode])
 * createRoute("/dashboard/others", {
 *   query: { modal: { type: "info", mode: "edit" } },
 * });
 * // → "/dashboard/others?modal[type]=info&modal[mode]=edit"
 *
 * @example
 * // Example 4: Raw path usage (not in routes map)
 * createRoute("/custom/path/:slug", {
 *   params: { slug: "hello-world" },
 *   query: { debug: true },
 * });
 * // → "/custom/path/hello-world?debug=true"
 */


export function createRoute(route: RoutesMapKey, options: BuildUrlOptions = {}): string {
    // allow passing either a known route key or a raw path
    let finalRoute: string = (route && (route as keyof typeof routes) in routes) ? (routes as any)[route as keyof typeof routes] : String(route);

    // Replace path params like :id
    if (options.params) {
        Object.entries(options.params).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            finalRoute = finalRoute.replace(`:${key}`, encodeURIComponent(String(value)));
        });
    }

    // Build query string
    if (options.query) {
        const searchParams = new URLSearchParams();

        const buildParams = (obj: Record<string, any>, prefix = "") => {
            Object.entries(obj).forEach(([key, value]) => {
                if (value === undefined || value === null) return;
                const paramKey = prefix ? `${prefix}[${key}]` : key;

                if (typeof value === "object" && !Array.isArray(value)) {
                    buildParams(value, paramKey);
                } else {
                    // allow arrays and primitives - URLSearchParams will encode properly
                    searchParams.set(paramKey, String(value));
                }
            });
        };

        buildParams(options.query);

        const queryString = searchParams.toString();
        if (queryString) {
            finalRoute += `?${queryString}`;
        }
    }

    return finalRoute;
}



