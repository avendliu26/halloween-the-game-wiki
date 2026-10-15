const cardImages: Record<string, string> = {
  "/images/characters/civilians-official.webp": "/images/characters/civilians-card.webp",
  "/images/characters/michael-myers-official.webp": "/images/characters/michael-myers-card.webp"
};

export function getCardImageSrc(source: string): string {
  return cardImages[source] ?? source;
}
