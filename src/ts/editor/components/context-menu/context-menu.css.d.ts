declare namespace ContextMenuCssNamespace {
  export interface IContextMenuCss {
    button: string;
    item: string;
    list: string;
  }
}

declare const ContextMenuCssModule: ContextMenuCssNamespace.IContextMenuCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ContextMenuCssNamespace.IContextMenuCss;
};

export = ContextMenuCssModule;
