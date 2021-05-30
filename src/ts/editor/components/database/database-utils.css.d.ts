declare namespace DatabaseUtilsCssNamespace {
  export interface IDatabaseUtilsCss {
    contentPanel: string;
    databaseContainer: string;
    databaseSidebarButton: string;
    databaseSidebarButtonActive: string;
    sidebarPanel: string;
  }
}

declare const DatabaseUtilsCssModule: DatabaseUtilsCssNamespace.IDatabaseUtilsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DatabaseUtilsCssNamespace.IDatabaseUtilsCss;
};

export = DatabaseUtilsCssModule;
