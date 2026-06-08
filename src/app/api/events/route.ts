import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send heartbeat every 30s
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat', time: new Date().toISOString() })}\n\n`));
        } catch { clearInterval(heartbeat); }
      }, 30000);

      // Initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', time: new Date().toISOString() })}\n\n`));

      // Cleanup on close
      return () => clearInterval(heartbeat);
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
