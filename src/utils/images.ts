export function generatedImageUrl(location: string) {
  return `https://firebasestorage.googleapis.com/v0/b/rapid-marketing-ai.appspot.com/o/images%2F${location}?alt=media&`
}

export function dataURLtoFile(dataurl: string, filename: string) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}