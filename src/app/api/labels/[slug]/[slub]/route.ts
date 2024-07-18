export const GET = (request: Request) => {
  const endpoint = request.url.split("/labels/")[1];
  return Response.redirect(`https://api.ezyship.org/labels/${endpoint}`);
}