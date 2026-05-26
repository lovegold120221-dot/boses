import EventEmitter from 'eventemitter3';
import {
  LiveConnectConfig,
  LiveServerContent,
  LiveServerToolCall,
  LiveClientToolResponse,
  LiveServerToolCallCancellation,
  Part,
} from '@google/genai';
import { base64ToArrayBuffer } from './utils';
import { DEFAULT_LIVE_API_MODEL } from './constants';

interface ProxyMessage {
  type: string;
  data?: any;
}

export class ProxyLiveClient extends EventEmitter<{
  audio: (data: ArrayBuffer) => void;
  close: (event: CloseEvent) => void;
  content: (data: LiveServerContent) => void;
  error: (e: ErrorEvent) => void;
  interrupted: () => void;
  open: () => void;
  setupcomplete: () => void;
  toolcall: (toolCall: LiveServerToolCall) => void;
  toolcallcancellation: (toolcallCancellation: LiveServerToolCallCancellation) => void;
  turncomplete: () => void;
  inputTranscription: (text: string, isFinal: boolean) => void;
  outputTranscription: (text: string, isFinal: boolean) => void;
}> {
  public readonly model: string = DEFAULT_LIVE_API_MODEL;
  private ws: WebSocket | null = null;
  private _status: 'connected' | 'disconnected' | 'connecting' = 'disconnected';
  private pendingConfig: LiveConnectConfig | null = null;
  private connectingPromise: Promise<boolean> | null = null;

  public get status() {
    return this._status;
  }

  private wsUrl: string;

  constructor(model?: string) {
    super();
    if (model) this.model = model;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    this.wsUrl = `${protocol}//${host}/api/live`;
  }

  public async connect(config: LiveConnectConfig): Promise<boolean> {
    if (this._status === 'connected' || this._status === 'connecting') {
      return false;
    }

    this._status = 'connecting';
    this.pendingConfig = config;

    this.connectingPromise = this._connect();
    return this.connectingPromise;
  }

  private async _connect(): Promise<boolean> {
    try {
      this.ws = new WebSocket(this.wsUrl);
    } catch (e: any) {
      this._status = 'disconnected';
      const errorEvent = new ErrorEvent('error', {
        error: e,
        message: e?.message || 'Failed to connect to proxy.',
      });
      this.onError(errorEvent);
      return false;
    }

    this.ws.onopen = () => {
      if (this.pendingConfig) {
        this.ws!.send(JSON.stringify({
          type: 'config',
          data: { ...this.pendingConfig, model: this.model },
        }));
      }
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const msg: ProxyMessage = JSON.parse(event.data);
        this.handleMessage(msg);
      } catch (e) {
        console.error('Failed to parse proxy message:', e);
      }
    };

    this.ws.onerror = (e: Event) => {
      this.onError(new ErrorEvent('error', {
        error: e,
        message: 'WebSocket error',
      }));
    };

    this.ws.onclose = (e: CloseEvent) => {
      this._status = 'disconnected';
      const syntheticClose = new CloseEvent('close', {
        wasClean: e.wasClean,
        code: e.code,
        reason: e.reason,
      });
      this.emit('close', syntheticClose);
    };

    return new Promise<boolean>((resolve) => {
      const onOpen = () => {
        this._status = 'connected';
        this.emit('open');
        resolve(true);
      };
      const onClose = () => {
        resolve(false);
      };
      this.once('open', onOpen);
      this.once('close', onClose);
      setTimeout(() => {
        if (this._status === 'connecting') {
          this._status = 'disconnected';
          this.ws?.close();
          resolve(false);
        }
      }, 15000);
    });
  }

  private handleMessage(msg: ProxyMessage) {
    switch (msg.type) {
      case 'open':
        this._status = 'connected';
        this.emit('open');
        break;
      case 'setupcomplete':
        this.emit('setupcomplete');
        break;
      case 'close':
        this._status = 'disconnected';
        this.emit('close', new CloseEvent('close', { reason: msg.data?.reason }));
        break;
      case 'error':
        this.onError(new ErrorEvent('error', { message: msg.data?.message }));
        break;
      case 'audio':
        if (msg.data) {
          const buffer = base64ToArrayBuffer(msg.data);
          this.emit('audio', buffer);
        }
        break;
      case 'content':
        if (msg.data) {
          this.emit('content', msg.data as LiveServerContent);
        }
        break;
      case 'toolcall':
        if (msg.data) {
          this.emit('toolcall', msg.data as LiveServerToolCall);
        }
        break;
      case 'toolcallcancellation':
        if (msg.data) {
          this.emit('toolcallcancellation', msg.data as LiveServerToolCallCancellation);
        }
        break;
      case 'turncomplete':
        this.emit('turncomplete');
        break;
      case 'interrupted':
        this.emit('interrupted');
        break;
      case 'inputTranscription':
        if (msg.data) {
          this.emit('inputTranscription', msg.data.text, msg.data.isFinal);
        }
        break;
      case 'outputTranscription':
        if (msg.data) {
          this.emit('outputTranscription', msg.data.text, msg.data.isFinal);
        }
        break;
    }
  }

  public disconnect() {
    this._status = 'disconnected';
    this.ws?.send(JSON.stringify({ type: 'disconnect' }));
    this.ws?.close();
    this.ws = null;
  }

  public send(parts: Part | Part[], turnComplete: boolean = true) {
    if (this._status !== 'connected' || !this.ws) {
      console.warn('Cannot send: not connected');
      return;
    }
    this.ws.send(JSON.stringify({
      type: 'content',
      data: { parts: Array.isArray(parts) ? parts : [parts], turnComplete },
    }));
  }

  public sendRealtimeInput(chunks: Array<{ mimeType: string; data: string }>) {
    if (this._status !== 'connected' || !this.ws) {
      console.warn('Cannot send realtime input: not connected');
      return;
    }
    this.ws.send(JSON.stringify({
      type: 'realtimeInput',
      data: { chunks },
    }));
  }

  public sendToolResponse(toolResponse: LiveClientToolResponse) {
    if (this._status !== 'connected' || !this.ws) {
      console.warn('Cannot send tool response: not connected');
      return;
    }
    this.ws.send(JSON.stringify({
      type: 'toolResponse',
      data: toolResponse,
    }));
  }

  private onError(e: ErrorEvent) {
    this._status = 'disconnected';
    console.error('Proxy Live Client Error:', e.message);
    this.emit('error', e);
  }
}
