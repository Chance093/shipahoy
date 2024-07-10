export const GET = (request: Request) => {
  const endpoint = request.url.split("/label/")[1];
  return Response.redirect(`https://api.weshipsmart.com/labels/${endpoint}`);
}