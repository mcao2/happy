import type { HappySessionClientLike } from './offline-stub';
import type {
  PiExtensionApiLike,
  PiHappyExtensionContext,
  PiHappyModelSelectEvent,
} from './types';

export type PiHappyMetadataPatch = {
  tools: string[];
  slashCommands: string[];
  currentModelCode?: string;
  startedBy?: string;
  startedFromDaemon?: boolean;
  hostPid?: number;
};

export function collectMetadataPatch(
  pi: Pick<PiExtensionApiLike, 'getAllTools' | 'getCommands'>,
  ctx: Pick<PiHappyExtensionContext, 'model'>,
): PiHappyMetadataPatch {
  return {
    tools: pi.getAllTools().map(tool => tool.name),
    slashCommands: pi.getCommands().map(command => command.name),
    currentModelCode: process.env.PI_MODEL || ctx.model?.name,
    startedBy: process.env.HAPPY_STARTED_BY || 'terminal',
    startedFromDaemon: process.env.HAPPY_STARTED_BY === 'daemon',
    hostPid: process.pid,
  };
}

export async function syncModelSelection(
  client: HappySessionClientLike,
  event: PiHappyModelSelectEvent,
): Promise<void> {
  await client.updateMetadata(metadata => ({
    ...metadata,
    currentModelCode: event.model.name,
  }));
}
