declare namespace TransferPlayerCssNamespace {
  export interface ITransferPlayerCss {
    content: string;
    helpText: string;
    helpTextContainer: string;
    labelHeaderText: string;
    labelsContainer: string;
    mapListContainer: string;
    mapPreviewContainer: string;
    selectedCoordinatesLabel: string;
    selectedMapLabel: string;
  }
}

declare const TransferPlayerCssModule: TransferPlayerCssNamespace.ITransferPlayerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TransferPlayerCssNamespace.ITransferPlayerCss;
};

export = TransferPlayerCssModule;
