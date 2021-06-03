declare namespace EditorCssNamespace {
  export interface IEditorCss {
    nav: string;
    sidebar: string;
  }
}

declare const EditorCssModule: EditorCssNamespace.IEditorCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: EditorCssNamespace.IEditorCss;
};

export = EditorCssModule;
