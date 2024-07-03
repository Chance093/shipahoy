import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware((auth, req) => {

}, { debug: true })

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};