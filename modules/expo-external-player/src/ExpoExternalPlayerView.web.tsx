import * as React from 'react';

import { ExpoExternalPlayerViewProps } from './ExpoExternalPlayer.types';

export default function ExpoExternalPlayerView(props: ExpoExternalPlayerViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
