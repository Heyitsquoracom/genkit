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

import { readFileSync } from 'fs';
import { Prompt } from './prompt';
export { Prompt as PromptFile };
import { basename } from 'path';
import { lookupPrompt } from './registry';

export function loadPromptFile(path: string): Prompt {
  return Prompt.parse(
    basename(path).split('.')[0],
    readFileSync(path, 'utf-8')
  );
}

export async function loadPromptUrl(
  name: string,
  url: string
): Promise<Prompt> {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(url);
  const text = await response.text();
  return Prompt.parse(name, text);
}

export async function prompt<Variables = unknown>(
  name: string,
  options?: { variant?: string }
): Promise<Prompt<Variables>> {
  return (await lookupPrompt(name, options?.variant)) as Prompt<Variables>;
}

export { Prompt, PromptOptions, PromptAction, PromptInput } from './prompt.js';
