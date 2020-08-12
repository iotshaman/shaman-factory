import { Response } from "express";

export class FormActionResponse {

  response?: (res: Response) => void;

  constructor(response?: (res: Response) => void) {
    this.response = response;
  }

}