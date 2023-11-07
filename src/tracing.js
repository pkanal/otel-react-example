// tracing.js
import { WebTracerProvider, BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { Resource }  from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { WebVitalsInstrumentation } from './web-vitals-instrumentation';


diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const exporter = new ConsoleSpanExporter();

// The TracerProvider is the core library for creating traces
const provider = new WebTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'react-otel-experiment',
  }),
});

// The processor sorts through data as it comes in, before it is sent to the exporter
provider.addSpanProcessor(new BatchSpanProcessor(exporter));

// A context manager allows OTel to keep the context of function calls across async functions
// ensuring you don't have disconnected traces
provider.register({
  contextManager: new ZoneContextManager()
});

// 
registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations(),
    new WebVitalsInstrumentation()
  ],
});
