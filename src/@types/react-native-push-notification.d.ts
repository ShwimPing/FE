declare module 'react-native-push-notification' {
  interface PushNotificationOptions {
    channelId?: string;
    title?: string;
    message: string;
    playSound?: boolean;
    soundName?: string;
    importance?: 'default' | 'high' | 'low' | 'min';
    vibrate?: boolean;
  }

  export default class PushNotification {
    static configure(options: any): void;
    static createChannel(options: any, callback?: (created: boolean) => void): void;
    static localNotification(options: PushNotificationOptions): void;
  }
}
