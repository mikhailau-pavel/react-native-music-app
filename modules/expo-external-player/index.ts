import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoExternalPlayer.web.ts
// and on native platforms to ExpoExternalPlayer.ts
import ExpoExternalPlayerModule from './src/ExpoExternalPlayerModule';
import ExpoExternalPlayerView from './src/ExpoExternalPlayerView';
import { ChangeEventPayload, ExpoExternalPlayerViewProps } from './src/ExpoExternalPlayer.types';

// Get the native constant value.
export const PI = ExpoExternalPlayerModule.PI;

export function hello(): string {
  return ExpoExternalPlayerModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoExternalPlayerModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoExternalPlayerModule ?? NativeModulesProxy.ExpoExternalPlayer);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoExternalPlayerView, ExpoExternalPlayerViewProps, ChangeEventPayload };
