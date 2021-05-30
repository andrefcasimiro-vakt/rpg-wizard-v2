declare namespace ResourceManagerCssNamespace {
  export interface IResourceManagerCss {
    button: string;
    container: string;
    folderButton: string;
    folderButtonActive: string;
    folderContainer: string;
    folders: string;
    grid: string;
    sidebarToolbarContainer: string;
  }
}

declare const ResourceManagerCssModule: ResourceManagerCssNamespace.IResourceManagerCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ResourceManagerCssNamespace.IResourceManagerCss;
};

export = ResourceManagerCssModule;
