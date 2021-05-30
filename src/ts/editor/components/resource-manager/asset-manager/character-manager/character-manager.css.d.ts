declare namespace CharacterManagerCssNamespace {
  export interface ICharacterManagerCss {
    animationField: string;
    container: string;
  }
}

declare const CharacterManagerCssModule: CharacterManagerCssNamespace.ICharacterManagerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: CharacterManagerCssNamespace.ICharacterManagerCss;
};

export = CharacterManagerCssModule;
