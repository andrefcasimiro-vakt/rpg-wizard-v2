declare namespace PropManagerCssNamespace {
  export interface IPropManagerCss {
    container: string;
  }
}

declare const PropManagerCssModule: PropManagerCssNamespace.IPropManagerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PropManagerCssNamespace.IPropManagerCss;
};

export = PropManagerCssModule;
