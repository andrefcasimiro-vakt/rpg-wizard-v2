declare namespace AnimationEditorCssNamespace {
  export interface IAnimationEditorCss {
    animationContainer: string;
    animationContent: string;
    animationField: string;
  }
}

declare const AnimationEditorCssModule: AnimationEditorCssNamespace.IAnimationEditorCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AnimationEditorCssNamespace.IAnimationEditorCss;
};

export = AnimationEditorCssModule;
