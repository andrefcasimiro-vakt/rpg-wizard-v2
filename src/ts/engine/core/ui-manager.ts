export class UIManager {

  public static setLoadingScreenVisible(value: boolean) {
    document.getElementById('loading-screen').style.display = value ? 'flex' : 'none'
  }

}