declare namespace AssetManagerCssNamespace {
  export interface IAssetManagerCss {
    assetConfigurationContent: string;
    assetSettingsContainer: string;
    childrenContainer: string;
    childrenContent: string;
    container: string;
    grid: string;
    headerText: string;
    modelViewerContainer: string;
    submitButton: string;
  }
}

declare const AssetManagerCssModule: AssetManagerCssNamespace.IAssetManagerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AssetManagerCssNamespace.IAssetManagerCss;
};

export = AssetManagerCssModule;
