declare namespace TriggerPanelCssNamespace {
  export interface ITriggerPanelCss {
    panel: string;
  }
}

declare const TriggerPanelCssModule: TriggerPanelCssNamespace.ITriggerPanelCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: TriggerPanelCssNamespace.ITriggerPanelCss;
};

export = TriggerPanelCssModule;
