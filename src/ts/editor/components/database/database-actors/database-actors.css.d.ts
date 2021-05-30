declare namespace DatabaseActorsCssNamespace {
  export interface IDatabaseActorsCss {
    content: string;
  }
}

declare const DatabaseActorsCssModule: DatabaseActorsCssNamespace.IDatabaseActorsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DatabaseActorsCssNamespace.IDatabaseActorsCss;
};

export = DatabaseActorsCssModule;
