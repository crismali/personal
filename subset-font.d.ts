declare module 'subset-font' {
  function subsetFont(
    buffer: Buffer,
    characters: string,
    options: { targetFormat: 'woff2' | 'woff' | 'truetype' | 'sfnt' }
  ): Promise<Buffer>
  export default subsetFont
}
