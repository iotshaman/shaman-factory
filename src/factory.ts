export class Factory {

  Generate = (command: string, name: string, template: string = "default") => {
    console.log({command, name, template});
  }

}