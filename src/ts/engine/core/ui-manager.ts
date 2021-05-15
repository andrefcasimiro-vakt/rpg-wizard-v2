export class UIManager {

  public static setLoadingScreenVisible(value: boolean) {
    const loadingScreenElement = document.getElementById('loading-screen')
    if (!loadingScreenElement) {
      return
    }

    loadingScreenElement.style.display = value ? 'flex' : 'none'
  }
  
}
