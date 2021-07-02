declare namespace AbstractModelManagerCssNamespace {
  export interface IAbstractModelManagerCss {
    checkboxContainer: string;
    container: string;
    materialInputContainer: string;
    materialName: string;
    modelViewerContainer: string;
  }
}

declare const AbstractModelManagerCssModule: AbstractModelManagerCssNamespace.IAbstractModelManagerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AbstractModelManagerCssNamespace.IAbstractModelManagerCss;
};

export = AbstractModelManagerCssModule;
