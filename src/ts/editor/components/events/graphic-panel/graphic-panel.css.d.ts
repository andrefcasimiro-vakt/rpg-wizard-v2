declare namespace GraphicPanelCssNamespace {
  export interface IGraphicPanelCss {
    field: string;
    panel: string;
  }
}

declare const GraphicPanelCssModule: GraphicPanelCssNamespace.IGraphicPanelCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GraphicPanelCssNamespace.IGraphicPanelCss;
};

export = GraphicPanelCssModule;
