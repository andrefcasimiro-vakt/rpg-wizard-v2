declare namespace TransferPlayerCssNamespace {
  export interface ITransferPlayerCss {
    content: string;
    mapListContainer: string;
    mapPreviewContainer: string;
  }
}

declare const TransferPlayerCssModule: TransferPlayerCssNamespace.ITransferPlayerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransferPlayerCssNamespace.ITransferPlayerCss;
};

export = TransferPlayerCssModule;
