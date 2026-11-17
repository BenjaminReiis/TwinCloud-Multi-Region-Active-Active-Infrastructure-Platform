# TwinCloud — Multi-Region Active-Active Infrastructure Platform

A cloud infrastructure management platform designed to monitor, visualize, and manage distributed workloads across multiple geographic regions.

TwinCloud provides a centralized operational dashboard for monitoring infrastructure health, service utilization, deployment activity, incidents, and real-time performance metrics.

Built with **React, TypeScript, Tailwind CSS, and Bolt Database**, the platform features an enterprise-inspired interface focused on infrastructure visibility and operational management.

---

## Overview

TwinCloud brings essential multi-region infrastructure operations into a single interface, allowing operators to monitor regional health, track deployments, inspect incidents, and analyze service performance.

### Key Capabilities

- Global infrastructure monitoring
- Multi-region health visualization
- Service resource utilization tracking
- Deployment lifecycle management
- Incident monitoring and tracking
- Performance metrics and analytics

---

## Features

### 1. Infrastructure Dashboard

A centralized overview of global infrastructure health and operational activity.

- Real-time infrastructure overview with key performance indicators.
- Regional health monitoring with status indicators and load sparklines.
- Recent deployment activity feed.
- CPU and memory utilization gauges for services.
- Active and resolved incident summaries.
- Global throughput, success rate, and infrastructure coverage statistics.

### 2. Global Regions

Interactive visualization and monitoring of geographically distributed infrastructure.

- Interactive world map with animated regional connection lines.
- Regional health and availability indicators.
- Latency, uptime, workload, and instance count.
- Region status classification:
  - Active
  - Degraded
  - Maintenance
  - Offline
- Detailed regional views with performance trends.
- Aggregated statistics for latency, workload, and infrastructure capacity.

### 3. Service Management

A centralized catalog for managing and monitoring deployed workloads.

- Searchable service catalog with status filtering.
- CPU and memory utilization monitoring.
- Color-coded resource consumption indicators.
- One-click deployment action with a simulated deployment cycle.
- Container image references and port mappings.

**Supported service types:**

| Type | Description |
|---|---|
| Web | Web applications |
| API | Backend services and APIs |
| Worker | Background processing |
| Database | Data storage services |
| Cache | Caching infrastructure |
| Queue | Message processing |

### 4. Deployment Management

Deployment history and lifecycle visibility across infrastructure regions.

- Timeline-based deployment history.
- Deployment status filtering.
- Version and target region information.
- Deployment duration and execution logs.
- Trigger type identification.

**Deployment statuses:**
- In Progress
- Succeeded
- Failed
- Rolled Back
- Pending

**Deployment triggers:**
- Manual
- Auto-Scale
- Rollback
- Scheduled

### 5. Incident Management

Incident tracking and operational visibility across affected services and regions.

- Expandable incident cards with detailed information.
- Severity classification from SEV1 to SEV4.
- Incident lifecycle tracking.
- Affected services and infrastructure regions.
- Creation and resolution timestamps.

**Severity levels:**

| Level | Classification |
|---|---|
| SEV1 | Critical |
| SEV2 | High |
| SEV3 | Medium |
| SEV4 | Minor |

**Incident statuses:**
- Investigating
- Identified
- Monitoring
- Resolved

### 6. Infrastructure Metrics

Performance analytics with regional filtering and historical visualization.

**Available metrics:**
- Requests per second
- Latency
- Error rate
- CPU utilization
- Memory utilization

**Visualization capabilities:**
- Interactive SVG line charts.
- Per-region performance graphs.
- Region-based filtering.
- Average and peak metric breakdowns.
- Comparative mini-bar visualizations.
- 24-hour monitoring window with hourly snapshots.

---

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React 18, TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Database | Bolt Database |
| Database Engine | PostgreSQL |
| Security | Row Level Security (RLS) |
| Visualization | Custom SVG Charts and Sparklines |

---

## Architecture

TwinCloud uses a single-tenant database architecture organized around five core entities.

### Database Schema

| Table | Responsibility |
|---|---|
| `regions` | Geographic deployment regions, coordinates, status, and health metrics. |
| `services` | Deployable workloads and resource utilization. |
| `deployments` | Deployment records, versions, statuses, and audit logs. |
| `incidents` | Incident severity, lifecycle, and affected services. |
| `metrics` | Time-series infrastructure snapshots for monitoring and analytics. |

### Database Security

All database tables have Row Level Security (RLS) enabled.

The demonstration environment uses public read/write policies to simplify access to seeded sample data. These policies are intended exclusively for the demo environment and should be replaced with authenticated, role-based access policies before production deployment.

---

## User Interface & Design

TwinCloud features a dark interface inspired by enterprise cloud infrastructure and observability platforms.

### Design Principles

- Deep slate color palette with blue and cyan accents.
- Consistent 8px spacing system.
- Clean and structured dashboard layouts.
- Smooth fade-in transitions between views.
- Animated global infrastructure map.
- Pulsing regional status indicators.
- Responsive layouts for mobile and desktop.
- Collapsible navigation sidebar.
- Custom SVG charts and sparklines.
- Color-coded operational status indicators.
- Live UTC clock in the application header.

---

## Getting Started

TwinCloud is designed to run directly on the Bolt platform.

The Bolt Database is pre-provisioned with sample data covering eight global infrastructure regions.

No manual database provisioning or additional setup is required within the configured Bolt environment.

---

## Project Structure

```text
src/
├── components/
│   ├── Sidebar
│   ├── Topbar
│   ├── StatusBadges
│   └── Charts
│
├── hooks/
│   └── Data-fetching hooks
│
├── lib/
│   ├── Database client
│   ├── Types
│   └── Theme configuration
│
├── views/
│   ├── Dashboard
│   ├── Regions
│   ├── Services
│   ├── Deployments
│   ├── Incidents
│   └── Metrics
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## Project Scope

TwinCloud currently provides a demonstration environment for multi-region infrastructure monitoring and management.

Certain operational workflows, including deployment execution and infrastructure status transitions, use simulated behavior rather than actual cloud infrastructure orchestration.

The platform establishes a foundation for exploring infrastructure visibility, distributed systems concepts, operational monitoring, and cloud management interfaces.

---

**TwinCloud — Global Infrastructure. Unified Visibility.**
