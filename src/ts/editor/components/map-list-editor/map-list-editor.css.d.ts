declare namespace MapListEditorCssNamespace {
  export interface IMapListEditorCss {
    addButton: string;
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

declare const MapListEditorCssModule: MapListEditorCssNamespace.IMapListEditorCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MapListEditorCssNamespace.IMapListEditorCss;
};

export = MapListEditorCssModule;
