declare namespace ConditionPanelCssNamespace {
  export interface IConditionPanelCss {
    addSwitchButton: string;
    switchContainer: string;
    switchList: string;
    switchManagementButtons: string;
    switchName: string;
    switchPanel: string;
    switchRemoveButton: string;
  }
}

declare const ConditionPanelCssModule: ConditionPanelCssNamespace.IConditionPanelCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ConditionPanelCssNamespace.IConditionPanelCss;
};

export = ConditionPanelCssModule;
