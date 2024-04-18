'use client'
 
export default function generatedImageUrl(location: string) {
  return `https://firebasestorage.googleapis.com/v0/b/rapid-marketing-ai.appspot.com/o/images%2F${location}?alt=media&`
}