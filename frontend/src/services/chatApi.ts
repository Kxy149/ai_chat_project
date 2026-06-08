export interface StreamChatPayload {
  conversationId: number | string;
  message: string;
  model?: string;
}

export interface StreamHandlers {
  onToken: (token: string) => void;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (message: string) => void;
}

async function readEventStream(response: Response, handlers: StreamHandlers) {
  if (!response.ok || !response.body) {
    throw new Error(`请求失败：${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      const line = event.split('\n').find((item) => item.startsWith('data: '));
      if (!line) {
        continue;
      }

      const raw = line.slice(6);
      const data = JSON.parse(raw) as { type: string; content?: string; message?: string };

      if (data.type === 'token') {
        handlers.onToken(data.content ?? '');
      }

      if (data.type === 'done') {
        handlers.onDone?.();
      }

      if (data.type === 'stopped') {
        handlers.onStopped?.();
      }

      if (data.type === 'error') {
        handlers.onError?.(data.message ?? 'AI 回复失败');
      }
    }
  }
}

export async function streamChat(payload: StreamChatPayload, handlers: StreamHandlers, signal?: AbortSignal) {
  const token = localStorage.getItem('auth_token');
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload),
    signal
  });

  await readEventStream(response, handlers);
}

export async function regenerateChat(payload: { conversationId: number | string; model?: string }, handlers: StreamHandlers, signal?: AbortSignal) {
  const token = localStorage.getItem('auth_token');
  const response = await fetch('/api/chat/regenerate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload),
    signal
  });

  await readEventStream(response, handlers);
}
