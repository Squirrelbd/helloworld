---
slug: telemetry-reference
title: From sensor to dashboard
summary: Follow a telemetry reading from a hardware input through firmware, connectivity, ingestion, and the application that makes it useful.
category: IoT architecture
kind: reference
tags: [Embedded devices, Telemetry, Edge to cloud]
featured: true
order: 1000
---

## The problem

A temperature reading is only useful when its destination can tell what it measures, when it was taken, and whether it is still current. This reference design walks through those decisions for a remote monitoring system.

## System architecture

1. **Sensor.** Samples a measurement in a known unit and reports the status of the input.
2. **Device.** Validates the sample, timestamps it, and gives it a stable identifier before placing it in a bounded queue.
3. **Gateway.** Carries the message over the available uplink. If the connection drops, it can buffer recent samples within a fixed storage limit.
4. **Cloud ingestion.** Checks the message schema and deduplicates retransmissions by device and sample identifier.
5. **Application.** Displays the latest value with its age, recent trends, and a visible stale or offline state.

## Design decisions

**Decouple sampling from transmission.** The firmware can maintain a predictable sampling interval while connectivity comes and goes. A bounded queue limits the effect of a long outage on storage and power consumption.

**Preserve time and identity.** A timestamp from the device helps distinguish a delayed observation from a new one. A stable sample identifier makes retries easier to handle without inflating historical counts.

**Expose freshness.** The application can distinguish a live measurement from the last one it received. An explicit stale state keeps the last good reading useful without implying that it is current.

## How to validate the design

- Disconnect the uplink while sampling continues. Check queue growth, the chosen overflow behavior, and recovery after reconnection.
- Send the same sample twice. Check that it appears once in the application history.
- Send an invalid unit or an implausible timestamp. Check that ingestion surfaces the error and preserves the validity of existing data.
- Stop a device from transmitting. Check that the application marks its last reading as stale after the configured interval.

This is an illustrative design. The validation steps describe expected behavior for a future implementation.
