export class Prompt {
	constructor(public key: string, public prompt: string, public validator?: (answer: string) => boolean) {
    if (!this.validator) this.validator = (_answer: string) => true;
  }
}