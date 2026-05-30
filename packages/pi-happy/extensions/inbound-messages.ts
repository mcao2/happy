import type { UserMessage } from '@slopus/happy-wire';

import type { HappySessionClientLike } from './offline-stub';
import type { PiExtensionApiLike, PiHappyExtensionContext } from './types';

export function extractInboundUserText(message: UserMessage): string | null {
  if (message.role !== 'user' || message.content.type !== 'text') {
    return null;
  }

  const text = message.content.text.trim();
  return text.length > 0 ? text : null;
}

export type InboundMessageBridgeOptions = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  onBeforeSend?: (text: string) => void;
};

export function bridgeInboundUserMessage(
  message: UserMessage,
  pi: Pick<PiExtensionApiLike, 'sendUserMessage'>,
  ctx: Pick<PiHappyExtensionContext, 'hasUI' | 'isIdle' | 'ui'>,
  options?: InboundMessageBridgeOptions,
): void {
  const text = extractInboundUserText(message);
  if (!text) {
    return;
  }

  options?.onBeforeSend?.(text);

  if (ctx.isIdle()) {
    pi.sendUserMessage(text);
  } else {
    pi.sendUserMessage(text, { deliverAs: 'steer' });
  }

  if (ctx.hasUI) {
    ctx.ui.notify?.('📱 Message from Happy', 'info');
  }
}

export function registerInboundMessageBridge(
  client: HappySessionClientLike,
  pi: Pick<PiExtensionApiLike, 'sendUserMessage'>,
  ctx: Pick<PiHappyExtensionContext, 'hasUI' | 'isIdle' | 'ui'>,
  options: InboundMessageBridgeOptions = {},
): void {
  client.onUserMessage(message => {
    try {
      bridgeInboundUserMessage(message, pi, ctx, options);
      options.onSuccess?.();
    } catch (error) {
      options.onError?.(error);
    }
  });
}
