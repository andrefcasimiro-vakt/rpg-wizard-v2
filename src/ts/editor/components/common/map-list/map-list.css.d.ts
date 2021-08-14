declare namespace MapListCssNamespace {
  export interface IMapListCss {
    guiHeaderText: string;
    guiPanel: string;
    header: string;
    mapButton: string;
    mapButtonActive: string;
    mapItem: string;
    mapList: string;
    mapListContainer: string;
  }
}

declare const MapListCssModule: MapListCssNamespace.IMapListCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MapListCssNamespace.IMapListCss;
};

export = MapListCssModule;
