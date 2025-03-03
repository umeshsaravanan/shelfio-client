export function generatePath(shelf = null, book = null, page = null) {
  let pathParts = [];

  if (shelf && shelf?.id) {
    pathParts.push(`shelf/${shelf.name}/${shelf.id}`);
  }

  if (book) {
    pathParts.push(`book/${book.name}/${book.id}`);
  }

  if (page) {
    pathParts.push(`page/${page.name}/${page.id}`);
  }

  return pathParts.join("/");
}
