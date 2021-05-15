import { Theme } from "src/ts/editor/config/theme"

const DIALOGUE_UI_ID = 'dialogueWindow'

export class UIDialogueManager {

  public static showDialogue(actorName: string, message: string) {
    const dialogueUi = document.createElement('div')
    dialogueUi.id = DIALOGUE_UI_ID
    dialogueUi.style.position = 'absolute'
    dialogueUi.style.left = '5%'
    dialogueUi.style.bottom = '5%'
    dialogueUi.style.right = '5%'
    dialogueUi.style.background = '#283878'
    dialogueUi.style.paddingLeft = '10px'
    dialogueUi.style.paddingBottom = '20px'
    dialogueUi.style.borderRadius = '10px'
    dialogueUi.style.border = `2px solid ${Theme.LIGHT}`
    dialogueUi.style.color = Theme.LIGHT
    document.body.appendChild(dialogueUi)

    const actorNameText = document.createElement('h4')
    actorNameText.innerHTML = actorName
    dialogueUi.appendChild(actorNameText)

    const messageText = document.createElement('p')
    dialogueUi.appendChild(messageText)

    var i = 0;
    var speed = 50; /* The speed/duration of the effect in milliseconds */
    
    function typeWriter() {
      if (i < message.length) {
        messageText.innerHTML += message.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    }

    typeWriter()
  }

  public static closeDialogue() {
    try {
      var dialogueUi = document.querySelector(`#${DIALOGUE_UI_ID}`)

      document.body.removeChild(dialogueUi)
    } catch (e) {
      
    }
  }
  
}
