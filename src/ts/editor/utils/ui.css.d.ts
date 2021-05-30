declare namespace UiCssNamespace {
  export interface IUiCss {
    databaseSidebarButton: string;
  }
}

declare const UiCssModule: UiCssNamespace.IUiCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: UiCssNamespace.IUiCss;
};

export = UiCssModule;
