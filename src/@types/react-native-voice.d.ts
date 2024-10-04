declare module 'react-native-voice' {
  // SpeechResultsEvent 타입 정의
  type SpeechResultsEvent = {
    value: string[]; // value 속성을 string 배열로 정의
  };

  class Voice {
    static start(locale: string): Promise<void>;
    static stop(): Promise<void>;
    static cancel(): Promise<void>;
    static destroy(): Promise<void>;
    static isAvailable(): Promise<boolean>;
    static onSpeechStart: (callback: () => void) => void;
    static onSpeechEnd: (callback: () => void) => void;
    static onSpeechResults: (callback: (event: SpeechResultsEvent) => void) => void;
    static onSpeechError: (callback: (error: { message: string }) => void) => void;
  }

  export default Voice;
}
