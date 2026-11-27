/**
 * Prometheus metrics for Fastify services.
 *
 * Exposes GET /metrics at the service root. The gateway only proxies
 * /<service>/* paths, so /metrics is reachable on the internal Docker
 * network (Prometheus) but never from the internet.
 */
import type { FastifyInstance } from 'fastify';
import client from 'prom-client';

export const registry = new client.Registry();
let initialised = false;

export const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'HTTP requests',
  labelNames: ['service', 'method', 'route', 'status'] as const,
  registers: [registry],
});

export const httpLatency = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency',
  labelNames: ['service', 'method', 'route'] as const,
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30],
  registers: [registry],
});

export const eventsPublished = new client.Counter({
  name: 'events_published_total',
  help: 'Domain events delivered to Kafka',
  labelNames: ['service', 'topic', 'path'] as const, // path: direct | outbox
  registers: [registry],
});

export const outboxPending = new client.Gauge({
  name: 'outbox_pending_events',
  help: 'Events waiting in the outbox for Kafka delivery',
  labelNames: ['service'] as const,
  registers: [registry],
});

/** Custom gauges/counters for a service (e.g. relayer wallet balance). */
export function gauge(name: string, help: string, labelNames: string[] = []) {
  const existing = registry.getSingleMetric(name);
  if (existing) return existing as client.Gauge<string>;
  return new client.Gauge({ name, help, labelNames, registers: [registry] });
}

export function registerMetrics(fastify: FastifyInstance, service: string) {
  if (!initialised) {
    client.collectDefaultMetrics({ register: registry, labels: { service } });
    initialised = true;
  }

  fastify.addHook('onResponse', async (req, reply) => {
    const route = req.routeOptions?.url ?? 'unmatched';
    if (route === '/metrics' || route.endsWith('/health')) return;
    const labels = { service, method: req.method, route };
    httpRequests.inc({ ...labels, status: String(reply.statusCode) });
    httpLatency.observe(labels, reply.elapsedTime / 1000);
  });

  fastify.get('/metrics', async (_req, reply) => {
    reply.header('Content-Type', registry.contentType);
    return registry.metrics();
  });
}
