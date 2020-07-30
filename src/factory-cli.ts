#!/usr/bin/env node
import { Factory } from './factory';

/* istanbul ignore next */
(function() {
  const [command, name, template] = process.argv.slice(2);
  const factory = new Factory();
  factory.Generate(command, name, template);
})();