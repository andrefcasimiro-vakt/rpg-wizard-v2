declare namespace CharacterManagerCssNamespace {
  export interface ICharacterManagerCss {
    container: string;
  }
}

declare const CharacterManagerCssModule: CharacterManagerCssNamespace.ICharacterManagerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CharacterManagerCssNamespace.ICharacterManagerCss;
};

export = CharacterManagerCssModule;
