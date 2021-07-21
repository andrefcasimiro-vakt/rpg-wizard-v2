declare namespace EntitySettingsCssNamespace {
  export interface IEntitySettingsCss {
    entityPanelContainer: string;
    field: string;
  }
}

declare const EntitySettingsCssModule: EntitySettingsCssNamespace.IEntitySettingsCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: EntitySettingsCssNamespace.IEntitySettingsCss;
};

export = EntitySettingsCssModule;
