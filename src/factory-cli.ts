#!/usr/bin/env node
import { Factory } from './factory';

/* istanbul ignore next */
(function() {
  if (process.argv.length < 4) throw new Error("Invalid number of arguments.");
  const factory = new Factory();
  const [command] = process.argv.slice(2);
  factory.Generate(command, process.argv.slice(3));
})();