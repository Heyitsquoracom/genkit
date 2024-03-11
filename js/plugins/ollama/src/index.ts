import {
  GenerationRequest,
  GenerationResponseData,
  defineModel,
} from '@google-genkit/ai/model';
import { Plugin, genkitPlugin } from '@google-genkit/common/config';
import logging from '@google-genkit/common/logging';

interface OllamaPluginParams {
  models: { name: string; type?: 'chat' | 'generate' }[];
  /**
   *  ollama server address. If not pprovided the plugin will attempt to run `ollama serve`.
   */
  serverAddress?: string;
  /**
   * Make ollama pull the model (default false).
   */
  pullModel: boolean;
}

export const ollama: Plugin<[OllamaPluginParams]> = genkitPlugin(
  'ollama',
  async (params: OllamaPluginParams) => {
    const serverAddress = params?.serverAddress || startOllama();
    if (params.pullModel) {
      // TODO: https://github.com/ollama/ollama/blob/main/docs/api.md#pull-a-model
      throw new Error('Not implemented');
    }
    return {
      models: params.models.map((model) =>
        ollamaModel(model.name, model.type, serverAddress)
      ),
    };
  }
);

function startOllama(): string {
  // TODO: support starting the server and downloading models.
  // see https://github.com/ollama/ollama/blob/main/docs/faq.md#how-do-i-configure-ollama-server
  throw new Error('Not implemented');
}

function ollamaModel(
  name: string,
  type: 'chat' | 'generate' | undefined,
  serverAddress: string
) {
  return defineModel(
    {
      name: `ollama/${name}`,
    },
    async (input, streamingCallback) => {
      const request = {
        model: name,
        options: input.config,
        stream: !!streamingCallback,
      } as any;
      if (type === 'chat') {
        const messages: Message[] = [];
        input.messages.forEach((m) => {
          let messageText = '';
          const images: string[] = [];
          m.content.forEach((c) => {
            if (c.text) {
              messageText += c.text;
            }
            if (c.media) {
              images.push(c.media.url);
            }
          });
          messages.push({
            role: m.role,
            content: messageText,
            images: images.length > 0 ? images : undefined,
          });
        });
        request.messages = messages;
      } else {
        request.prompt = getPrompt(input);
      }
      logging.debug(request, `ollama request (type: ${type})`);
      const res = await fetch(
        serverAddress + (type === 'chat' ? '/api/chat' : '/api/generate'),
        {
          method: 'POST',
          body: JSON.stringify(request),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!res.body) {
        throw new Error('Response has no body');
      }

      let textResponse = '';
      if (streamingCallback) {
        const reader = res.body.getReader();
        const textDecoder = new TextDecoder();
        for await (const chunk of readChunks(reader)) {
          const chunkText = textDecoder.decode(chunk);
          const json = JSON.parse(chunkText);
          streamingCallback({
            index: 0,
            content: [
              {
                text:
                  type === 'chat'
                    ? (json.message as Message).content
                    : json.response,
              },
            ],
          });
          textResponse +=
            type === 'chat' ? (json.message as Message).content : json.response;
        }
      } else {
        const txtBody = await res.text();
        const json = JSON.parse(txtBody);
        textResponse = json.response;
      }
      logging.debug(textResponse, 'ollama final response');

      return {
        candidates: [
          {
            index: 0,
            finishReason: 'stop',
            message: {
              role: 'model',
              content: [
                {
                  text: textResponse,
                },
              ],
            },
          },
        ],
      } as GenerationResponseData;
    }
  );
}

function readChunks(reader) {
  return {
    async *[Symbol.asyncIterator]() {
      let readResult = await reader.read();
      while (!readResult.done) {
        yield readResult.value;
        readResult = await reader.read();
      }
    },
  };
}

function getPrompt(input: GenerationRequest) {
  // TODO: too naive...
  // see https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-chat-completion
  const content = input.messages[0]?.content[0];
  return content.text;
}

interface Message {
  role: string;
  content: string;
  images?: string[];
}