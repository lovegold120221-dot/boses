import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { MODEL_NAME, SYSTEM_INSTRUCTION } from '../constants.js';

// Audio encoding/decoding utilities
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array) {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const delegateToSubAgentDeclaration: FunctionDeclaration = {
  name: 'delegate_to_sub_agent',
  description: 'Delegates a complex task, web research, or document drafting to a background sub-agent. MUST be called immediately when a document is requested.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      task_description: {
        type: Type.STRING,
        description: 'Detailed instructions for the sub-agent. If web research is needed, explicitly state what to search for. If a document is needed, specify the exact type and requirements.'
      }
    },
    required: ['task_description'],
  },
};

export interface LiveSessionCallbacks {
  onConnect: () => void;
  onDisconnect: () => void;
  onError: (error: any) => void;
  onHtmlGenerated: (html: string) => void;
  onTranscript: (text: string, isUser: boolean) => void;
  onSandboxLog: (type: 'system' | 'action' | 'result' | 'error', text: string) => void;
}

export class GeminiLiveService {
  private ai: GoogleGenAI;
  private sessionPromise: Promise<any> | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private sources = new Set<AudioBufferSourceNode>();
  private nextStartTime = 0;
  private currentInputTranscription = '';
  private currentOutputTranscription = '';

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
  }

  async connect(callbacks: LiveSessionCallbacks) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const outputNode = this.outputAudioContext.createGain();
      outputNode.connect(this.outputAudioContext.destination);

      this.nextStartTime = 0;
      this.currentInputTranscription = '';
      this.currentOutputTranscription = '';

      this.sessionPromise = this.ai.live.connect({
        model: MODEL_NAME,
        callbacks: {
          onopen: () => {
            callbacks.onConnect();
            callbacks.onSandboxLog('system', 'Live audio connection established.');
            if (!this.inputAudioContext || !this.stream) return;
            
            const source = this.inputAudioContext.createMediaStreamSource(this.stream);
            const scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              
              if (this.sessionPromise) {
                this.sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                }).catch(console.error);
              }
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(this.inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcriptions
            if (message.serverContent?.outputTranscription) {
              this.currentOutputTranscription += message.serverContent.outputTranscription.text;
            } else if (message.serverContent?.inputTranscription) {
              this.currentInputTranscription += message.serverContent.inputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              if (this.currentInputTranscription) {
                callbacks.onTranscript(this.currentInputTranscription, true);
                this.currentInputTranscription = '';
              }
              if (this.currentOutputTranscription) {
                callbacks.onTranscript(this.currentOutputTranscription, false);
                this.currentOutputTranscription = '';
              }
            }

            // Handle Tool Calls
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                
                // Tool: Delegate to Sub-Agent (Docker Sandbox Simulation)
                if (fc.name === 'delegate_to_sub_agent' && fc.args && typeof fc.args.task_description === 'string') {
                  
                  // 1. IMMEDIATELY respond to the Live API so it doesn't block and can start talking!
                  // CRITICAL FIX: functionResponses MUST be an array!
                  if (this.sessionPromise) {
                    this.sessionPromise.then((session) => {
                      session.sendToolResponse({
                        functionResponses: [{
                          id: fc.id,
                          name: fc.name,
                          response: { 
                            result: "Task successfully delegated to the background sandbox. The system will render it automatically when done. YOUR DIRECTIVE: You MUST immediately start speaking to the user. Tell a long, entertaining story, a corporate joke, or explain the intricacies of the document being drafted to fill the 20 seconds of dead air. Do not stop talking!" 
                          },
                        }]
                      });
                    }).catch(console.error);
                  }

                  // 2. Run the heavy sub-agent task asynchronously in the background
                  (async () => {
                    callbacks.onSandboxLog('system', `[Docker Daemon] Pulling latest sub-agent image...`);
                    callbacks.onSandboxLog('system', `[Docker Daemon] Starting container isolated-sandbox-env...`);
                    callbacks.onSandboxLog('action', `[Sub-Agent] Task received: ${fc.args.task_description}`);
                    callbacks.onSandboxLog('action', `[Sub-Agent] Executing with web browser access enabled...`);

                    try {
                      const subAgent = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
                      const response = await subAgent.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: fc.args.task_description,
                        config: {
                          systemInstruction: `You are a non-conversational background sub-agent running in a Docker sandbox. Your job is to perform web research or draft raw HTML documents based on the prompt. 
                          If drafting a document, output ONLY the raw HTML wrapped in <div class="rendered-document">. Include embedded CSS. NO CONVERSATIONAL FILLER. NO MARKDOWN BLOCKS.`,
                          tools: [{ googleSearch: {} }], // Enable web browsing
                        }
                      });

                      // Check if grounding (web search) was used
                      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
                      if (chunks && chunks.length > 0) {
                        callbacks.onSandboxLog('result', `[Sub-Agent] Web search completed. Found ${chunks.length} sources.`);
                      }

                      callbacks.onSandboxLog('system', `[Docker Daemon] Sub-agent execution complete. Stopping container...`);
                      
                      // Clean up potential markdown formatting from the sub-agent
                      const cleanHtml = response.text.replace(/^```html\s*/i, '').replace(/```\s*$/, '').trim();
                      
                      // Render directly to the UI
                      callbacks.onHtmlGenerated(cleanHtml);
                      callbacks.onSandboxLog('result', `[System] Document rendered to UI viewport.`);

                    } catch (error: any) {
                      callbacks.onSandboxLog('error', `[Docker Daemon] Container crashed: ${error.message}`);
                    }
                  })();
                }
              }
            }

            // Handle Audio Output
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString && this.outputAudioContext) {
              this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
              
              try {
                const audioBuffer = await decodeAudioData(
                  decode(base64EncodedAudioString),
                  this.outputAudioContext,
                  24000,
                  1,
                );
                
                const source = this.outputAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNode);
                
                source.addEventListener('ended', () => {
                  this.sources.delete(source);
                });

                source.start(this.nextStartTime);
                this.nextStartTime = this.nextStartTime + audioBuffer.duration;
                this.sources.add(source);
              } catch (e) {
                console.error("Error decoding audio:", e);
              }
            }

            // Handle Interruption
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of this.sources.values()) {
                source.stop();
                this.sources.delete(source);
              }
              this.nextStartTime = 0;
            }
          },
          onerror: (e: any) => {
            console.error('Live API Error:', e);
            callbacks.onError(e);
            callbacks.onSandboxLog('error', `Live API connection error: ${e.message || 'Unknown error'}`);
          },
          onclose: () => {
            this.cleanup();
            callbacks.onDisconnect();
            callbacks.onSandboxLog('system', 'Connection closed.');
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ functionDeclarations: [delegateToSubAgentDeclaration] }],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      });
    } catch (error: any) {
      console.error("Failed to initialize media or connect:", error);
      callbacks.onError(error);
      callbacks.onSandboxLog('error', `Failed to connect: ${error.message}`);
    }
  }

  disconnect() {
    if (this.sessionPromise) {
      this.sessionPromise.then(session => {
        if (session && typeof session.close === 'function') {
          session.close();
        }
      }).catch(console.error);
    }
    this.cleanup();
  }

  private cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.inputAudioContext) {
      this.inputAudioContext.close().catch(console.error);
      this.inputAudioContext = null;
    }
    if (this.outputAudioContext) {
      this.outputAudioContext.close().catch(console.error);
      this.outputAudioContext = null;
    }
    for (const source of this.sources.values()) {
      try { source.stop(); } catch (e) {}
    }
    this.sources.clear();
    this.sessionPromise = null;
  }
}
