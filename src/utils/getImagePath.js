export default function getImagePath(image) {
  if (!image) {
    return '';
  }

  if (image.includes('imgur')) {
    return image.match(/https?:\/\/i\.imgur\.com\/(\w+)\.jpg/)[1];
  }

  return image;
}
