declare namespace TextureManagerCssNamespace {
  export interface ITextureManagerCss {
    container: string;
    textureImage: string;
  }
}

declare const TextureManagerCssModule: TextureManagerCssNamespace.ITextureManagerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TextureManagerCssNamespace.ITextureManagerCss;
};

export = TextureManagerCssModule;
