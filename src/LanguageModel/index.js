// Copyright (c) 2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { EventEmitter } from "events";
import callCallback from "../utils/callcallback";

import Llama2 from './llama2.js';
import Llama2Wasm from './llama2.wasm';
import Llama2Data from './llama2.data';


class LanguageModel extends EventEmitter {
  constructor(modelNameOrOptions, callback) {
    super();

    this.options = {
      modelUrl: '',          // if set, model.bin will be preloaded from provided URL (assumed to be embedded in llama2.data if not)
      tokenizerUrl: '',      // if set, tokenizer.bin will be preloaded from provided URL (assumed to be embedded in llama2.data if not)
      maxTokens: 0,          // how many tokens to generate (defaults to model's maximum)
      temperature: 1.0,      // 0.0 = (deterministic) argmax sampling, 1.0 = baseline, don't set higher
      topp: 0.9,             // p value in top-p (nucleus) sampling, 0 = off
      stopOnBosOrEos: true,  // stop when encountering beginning-of-sequence or end-of-sequence token
    };

    // handle arguments
    if (typeof modelNameOrOptions === 'string') {
      switch (modelNameOrOptions) {
        // see https://huggingface.co/karpathy/tinyllamas for TinyStories-*
        case 'TinyStories-15M':
          this.options.modelUrl = 'https://huggingface.co/karpathy/tinyllamas/resolve/main/stories15M.bin';
          break;
        case 'TinyStories-42M':
          this.options.modelUrl = 'https://huggingface.co/karpathy/tinyllamas/resolve/main/stories42M.bin';
          break;
        case 'TinyStories-110M':
          this.options.modelUrl = 'https://huggingface.co/karpathy/tinyllamas/resolve/main/stories110M.bin';
          break;
        default:
          throw 'Unrecognized model ' + modelNameOrUrl + ', try e.g. TinyStories-15M';
      }
    } else if (typeof modelNameOrOptions === 'object') {
        this.options.modelUrl = (typeof modelNameOrOptions.modelUrl === 'string') ? modelNameOrOptions.modelUrl : this.options.modelUrl;
        this.options.tokenizerUrl = (typeof modelNameOrOptions.tokenizerUrl === 'string') ? modelNameOrOptions.tokenizerUrl : this.options.tokenizerUrl;
    }

    if (!this.options.modelUrl) {
      throw 'You need to provide the name of the model to load, e.g. TinyStories-15M';
    }

    this.prompt = '';
    this.text = '';
    this.tokens = [];
    this.words = [];
    this.finished = true;

    // for compatibility with p5's preload()
    if (typeof window === 'object' && typeof window._incrementPreload === 'function') {
      window._incrementPreload();
    }

    this.ready = callCallback(this.loadModel(), callback);
  }

  async loadModel() {
    const onStdout = (str) => {
      //console.log('onStdout', str);
    };

    this.llama2 = await Llama2({
      locateFile(path) {
        if (path.endsWith('.wasm')) {
          return Llama2Wasm;
        }
        if (path.endsWith('.data')) {
          return Llama2Data;
        }
        return path;
      },
      arguments: ['model.bin'],
      print: onStdout,
      preRun: [
        (inst) => {
          // model.bin and tokenizer.bin can either be baked into the llama2.data file
          // (leading to a large library size), or dynamically from an URL provided as
          // an option
          if (this.options.modelUrl) {
            inst.FS_createPreloadedFile('', 'model.bin', this.options.modelUrl, true, false);
          }
          if (this.options.tokenizerUrl) {
            inst.FS_createPreloadedFile('', 'tokenizer.bin', this.options.tokenizerUrl, true, false);
          }
        }
      ]
    });

    const onTokenCallback = await this.llama2.addFunction((tokenStr, token, probability, finished) => {
      // ignore tokens after BOS or EOS (with stopOnBosOrEn on)
      if (this.finished) {
        return;
      }

      tokenStr = this.llama2.UTF8ToString(tokenStr);
      this.tokens.push({ index: token, str: tokenStr, probability: probability });
      // llama2.c signals finished after completing all steps
      if (finished) {
        this.finished = true;
      }

      // optionally stop after encountering BOS (1) or EOS (2)
      if (this.options.stopOnBosOrEos && (token == 1 || token == 2)) {
        this.finished = true;
      } else {
        this.text += tokenStr;
      }

      // on-token event
      this.emit('token', this);

      // redo word tokenization
      const wordDelimiters = ' .,:;"“?!\n';
      const re = new RegExp('(?=[' + wordDelimiters + '])|(?<=[' + wordDelimiters + '])', 'g');
      const newWords = this.text.split(re);
      // ignore the last word if we can't be certain it's complete
      if (!wordDelimiters.includes(this.text.slice(-1)) && !this.finished) {
        newWords.pop();
      }
      // on-word events
      for (let i=this.words.length; i < newWords.length; i++) {
        this.words[i] = newWords[i];
        this.emit('word', this);
      }

      // on-finished promise/event/callback
      if (this.finished) {
        // fulfill the promise returned by generate()
        if (this.promiseResolve) {
          this.promiseResolve(this.text);
        }
        this.emit('finish', this);
        if (this.callback) {
          this.callback(this);
        }
      }
    }, 'viifi');

    await this.llama2.ccall('register_callback', null, [ 'number' ], [ onTokenCallback ]);

    //console.log('loadModel done');

    // for compatibility with p5's preload()
    if (typeof window === 'object' && typeof window._decrementPreload === 'function') {
      window._decrementPreload();
    }
  }

  async generate(prompt, optionsOrCb, cb) {
    await this.ready;

    // handle arguments
    if (typeof optionsOrCb === 'function') {
      this.callback = optionsOrCb;
    } else {
      if (typeof optionsOrCb === 'object') {
        this.options.maxTokens = (typeof optionsOrCb.maxTokens === 'number') ? optionsOrCb.maxTokens : this.options.maxTokens;
        this.options.temperature = (typeof optionsOrCb.temperature === 'number') ? optionsOrCb.temperature : this.options.temperature;
        this.options.topp = (typeof optionsOrCb.topp === 'number') ? optionsOrCb.topp : this.options.topp;
        this.options.stopOnBosOrEos = (typeof optionsOrCb.stopOnBosOrEos == 'boolean') ? optionsOrCb.stopPropagation : this.options.stopOnBosOrEos;
      }
      if (typeof cb === 'function') {
        this.callback = cb;
      } else {
        this.callback = null;
      }
    }

    // if there are any outstanding requests, resolve them
    // with the output received so far
    if (this.promiseResolve) {
      this.promiseResolve(this.text);
    }

    await this.llama2.ccall('set_parameters', null, [ 'number', 'number', 'number' ], [ this.options.temperature, this.options.topp, this.options.maxTokens ]);

    this.prompt = prompt;
    this.text = '';
    this.tokens = [{ index: 1, str: '<s>', probability: 1 }];
    this.words = [];
    this.finished = false;

    await this.llama2.ccall('generate', null, [ 'string' ], [ prompt ]);

    return new Promise((resolve, reject) => {
      this.promiseResolve = resolve;
    });
  }

  async vocab() {
    if (this._vocab) {
      return this._vocab;
    }

    await this.ready;
    const vocabSize = await this.llama2.ccall('get_vocab_size', 'number', [], []);
    const vocabPtr = await this.llama2.ccall('get_vocab', 'number', [], []);
    this._vocab = new Array(vocabSize);
    for (let i=0; i < vocabSize; i++) {
      const strPtr = this.llama2.HEAPU32[(vocabPtr+4*i)/4];
      this._vocab[i] = this.llama2.UTF8ToString(strPtr);
    }
    return this._vocab;
  }

  async manualStart(prompt, optionsOrCb, cb) {
    await this.ready;

    // handle arguments
    if (typeof optionsOrCb === 'function') {
      this.callback = optionsOrCb;
    } else {
      if (typeof optionsOrCb === 'object') {
        this.options.maxTokens = (typeof optionsOrCb.maxTokens === 'number') ? optionsOrCb.maxTokens : this.options.maxTokens;
        this.options.temperature = (typeof optionsOrCb.temperature === 'number') ? optionsOrCb.temperature : this.options.temperature;
        this.options.topp = (typeof optionsOrCb.topp === 'number') ? optionsOrCb.topp : this.options.topp;
        this.options.stopOnBosOrEos = (typeof optionsOrCb.stopOnBosOrEos == 'boolean') ? optionsOrCb.stopPropagation : this.options.stopOnBosOrEos;
      }
      if (typeof cb === 'function') {
        this.callback = cb;
      } else {
        this.callback = null;
      }
    }

    // if there are any outstanding requests, resolve them
    // with the output received so far
    if (this.promiseResolve) {
      this.promiseResolve(this.text);
    }

    await this.llama2.ccall('set_parameters', null, [ 'number', 'number', 'number' ], [ this.options.temperature, this.options.topp, this.options.maxTokens ]);

    this.prompt = prompt;
    this.text = '';
    this.tokens = [];
    this.words = [];
    this.finished = true;

    let token = await this.llama2.ccall('manual_start', 'number', [ 'string' ], [ prompt ]);
    return this.manualNext(token);
  }

  async manualNext(token) {
    await this.ready;

    if (typeof token === 'number') {
      // nothing to do
    } else if (typeof token === 'object' && typeof token.index === 'number') {
      token = token.index;
    } else if (typeof token === 'string') {
      // check if numeric
      if (token.match(/^\d+$/)) {
        token = parseInt(token);
      } else {
        // look up in vocabulary
        const vocab = await this.vocab();
        let found = false;
        for (let i=0; i < vocab.length; i++) {
          if (token === vocab[i]) {
            token = i;
            found = true;
            break;
          }
        }
        if (!found) {
          throw 'Not in vocabulary: ' + token;
        }
      }
    } else {
      throw 'Unrecognized next token: ' + token;
    }

    const vocab = await this.vocab();
    const logitsPtr = await this.llama2.ccall('manual_next', 'number', [ 'number' ], [ token ]);

    const tokens = new Array(vocab.length-1);
    for (let i=1; i < vocab.length; i++) {
      tokens[i] = { index: i, str: vocab[i], probability: this.llama2.HEAPF32[(logitsPtr+i*4)/4] };
    }
    tokens.sort((a, b) => (a.probability > b.probability) ? -1 : 1);

    // on-tokens callback/event
    if (this.callback) {
      this.callback(tokens, this);
    }
    this.emit('tokens', tokens, this);

    return tokens;
  }

}


/**
 * exposes LanguageModel class through function
 * @returns {Object|Promise<Boolean>} A new LanguageModel instance
 */
const languageModel = (modelNameOrOptions, callback) => {
  const instance = new LanguageModel(modelNameOrOptions, callback);
  return instance;
};

export default languageModel;
