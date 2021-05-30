declare namespace SwitchListCssNamespace {
  export interface ISwitchListCss {
    actionsContainer: string;
    addSwitchBtn: string;
    selectedSwitchNameInput: string;
    selectedSwitchNameLabel: string;
    switchItemBtn: string;
    switchItemBtnActive: string;
    switchListContainer: string;
  }
}

declare const SwitchListCssModule: SwitchListCssNamespace.ISwitchListCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: SwitchListCssNamespace.ISwitchListCss;
};

export = SwitchListCssModule;
