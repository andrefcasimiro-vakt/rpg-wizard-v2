declare namespace DatabaseAnimationsCssNamespace {
  export interface IDatabaseAnimationsCss {
    animationContainer: string;
    content: string;
  }
}

declare const DatabaseAnimationsCssModule: DatabaseAnimationsCssNamespace.IDatabaseAnimationsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: DatabaseAnimationsCssNamespace.IDatabaseAnimationsCss;
};

export = DatabaseAnimationsCssModule;
