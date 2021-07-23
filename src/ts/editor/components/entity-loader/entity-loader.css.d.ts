declare namespace EntityLoaderCssNamespace {
  export interface IEntityLoaderCss {
    loadingEntitiesContainer: string;
    message: string;
    messageContainer: string;
  }
}

declare const EntityLoaderCssModule: EntityLoaderCssNamespace.IEntityLoaderCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: EntityLoaderCssNamespace.IEntityLoaderCss;
};

export = EntityLoaderCssModule;
