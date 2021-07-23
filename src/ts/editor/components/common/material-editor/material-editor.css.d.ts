declare namespace MaterialEditorCssNamespace {
  export interface IMaterialEditorCss {
    checkboxContainer: string;
    materialInputContainer: string;
    materialName: string;
  }
}

declare const MaterialEditorCssModule: MaterialEditorCssNamespace.IMaterialEditorCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: MaterialEditorCssNamespace.IMaterialEditorCss;
};

export = MaterialEditorCssModule;
