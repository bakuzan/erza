export default function getImagePath(image) {
  if (!image) {
    return '';
  }

  // Is imgur url or just a key on its own
  if (image.includes('imgur') || !image.includes('/')) {
    // Cutout the key from an imgur url
    const maybeKey = image.match(/https?:\/\/i\.imgur\.com\/(\w+)\.jpg/);

    // If maybeKey is null it is because image is the key
    const key = maybeKey ? maybeKey[1] : image;

    // Use key to fetch from folder via api
    return `${window.location.origin}/api/image/${key}`;
  }

  // Is not empty, Is not imgur, Is a url of some kind
  return image; // TODO: update data to make this case redundant.
}
