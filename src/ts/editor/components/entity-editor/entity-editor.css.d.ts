declare namespace EntityEditorCssNamespace {
  export interface IEntityEditorCss {
    addButton: string;
    container: string;
    entitiesList: string;
    entityBtn: string;
    entityBtnActive: string;
    guiHeaderText: string;
    header: string;
    menuContainer: string;
    menuItem: string;
    menuItemButton: string;
    menuItemButtonActive: string;
    panel: string;
  }
}

declare const EntityEditorCssModule: EntityEditorCssNamespace.IEntityEditorCss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: EntityEditorCssNamespace.IEntityEditorCss;
};

export = EntityEditorCssModule;
