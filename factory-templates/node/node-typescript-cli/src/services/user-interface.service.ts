import * as readline from 'readline';
import { KeyValuePair } from '../models/key-value-pair';
import { Prompt } from "../models/prompt";

export class UserInterfaceService {

  constructor(private stdinFactory?: () => readline.Interface) {
    if (!this.stdinFactory) this.stdinFactory = () => readline.createInterface(process.stdin, process.stdout);
  }

  prompt = async (prompt: Prompt): Promise<KeyValuePair> => {
    return this.question(prompt);
  }

  interrogate = async (prompts: Prompt[]): Promise<KeyValuePair[]> => {
		return prompts.reduce((a, b) => a.then(async rslt => {
			var result = await this.question(b);
			return [...rslt, result];
		}), Promise.resolve(<KeyValuePair<string>[]>[]));
	}

	private question = (prompt: Prompt, stdin?: readline.Interface): Promise<KeyValuePair> => {
		if (!stdin) stdin = this.stdinFactory();
		return new Promise(res => {
			stdin.question(prompt.prompt, answer => {
				answer = answer.trim();
				if (!prompt.validator(answer)) {
					console.warn('Invalid response.');
					return res(this.question(prompt, stdin));
				}
				stdin.close();
				return res({key: prompt.key, value: answer});
			});
		})
	}

}