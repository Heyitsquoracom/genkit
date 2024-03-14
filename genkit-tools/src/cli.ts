/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ToolPluginSubCommandsSchema } from '@genkit-ai/tools-plugins/plugins';
import * as clc from 'colorette';
import { Command, program } from 'commander';
import { evalExtractData } from './commands/eval-extract-data';
import { example } from './commands/example';
import { flowBatchRun } from './commands/flow-batch-run';
import { flowResume } from './commands/flow-resume';
import { flowRun } from './commands/flow-run';
import { getPluginCommands, getPluginSubCommand } from './commands/plugins';
import { start } from './commands/start';
import { logger } from './utils/logger';
import { evalRun } from './commands/eval-run';
import { evalFlowRun } from './commands/eval-flow-run';

/**
 * All commands need to be directly registered in this list.
 *
 * To add a new command to the CLI, create a file under src/commands that
 * exports a Command constant, then add it to the list below
 */
const commands: Command[] = [
  example,
  start,
  flowRun,
  flowBatchRun,
  flowResume,
  evalExtractData,
  evalRun,
  evalFlowRun,
];

/** Main entry point for CLI. */
export async function startCLI(): Promise<void> {
  program.name('genkit').description('Google Genkit CLI').version('0.0.1');

  for (const command of commands) program.addCommand(command);
  for (const command of await getPluginCommands()) program.addCommand(command);

  for (const cmd of ToolPluginSubCommandsSchema.keyof().options) {
    program.addCommand(await getPluginSubCommand(cmd));
  }

  // Default action to catch unknown commands.
  program.action((_, { args }: { args: string[] }) => {
    logger.error(`"${clc.bold(args[0])}" is not a known Genkit command.`);
  });

  await program.parseAsync();
}
