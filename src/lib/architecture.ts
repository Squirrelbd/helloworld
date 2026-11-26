export const stages = [
  { id: 'sensor', label: 'Sensor', role: 'Measure', detail: 'A sensor captures a physical measurement and passes it to the device.' },
  { id: 'device', label: 'Device', role: 'Process', detail: 'Firmware validates, timestamps, and queues the sample for transmission.' },
  { id: 'gateway', label: 'Gateway', role: 'Connect', detail: 'A gateway bridges the device to an uplink and can buffer data during an interruption.' },
  { id: 'cloud', label: 'Cloud', role: 'Ingest', detail: 'Ingestion validates the payload, handles duplicates, and stores the reading.' },
  { id: 'application', label: 'Application', role: 'Display', detail: 'The application presents current readings, trends, and data freshness.' }
] as const;
