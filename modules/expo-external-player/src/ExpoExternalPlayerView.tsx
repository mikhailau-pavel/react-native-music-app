import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoExternalPlayerViewProps } from './ExpoExternalPlayer.types';

const NativeView: React.ComponentType<ExpoExternalPlayerViewProps> =
  requireNativeViewManager('ExpoExternalPlayer');

export default function ExpoExternalPlayerView(props: ExpoExternalPlayerViewProps) {
  return <NativeView {...props} />;
}
