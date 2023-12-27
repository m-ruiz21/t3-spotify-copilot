export { default } from 'next-auth/middleware'

// stop static assets from being blocked by middleware
export const config = {
    matcher: "/_next/static"
};