TwinCloud — Multi-Region Active-Active Infrastructure Platform
A production-grade web platform for managing multi-region active-active cloud infrastructure. Built with React, TypeScript, Tailwind CSS, and Bolt Database.

Features
Dashboard
Real-time infrastructure overview with key metrics at a glance
Region health monitoring with status indicators and load sparklines
Recent deployment activity feed
Service resource usage (CPU & memory) with visual gauges
Incident summary with active and resolved status tracking
Global throughput, success rate, and coverage statistics
Regions
Interactive world map visualizing global infrastructure with animated connection lines
Per-region cards showing latency, uptime, load, and instance count
Status badges: Active, Degraded, Maintenance, Offline
Click any region for detailed trend charts and breakdown
Summary stats: total regions, average latency, average load, total instances
Services
Full service catalog with search and status filtering
Per-service CPU and memory utilization with color-coded progress bars
One-click deploy button that triggers a simulated deployment cycle
Service types: Web, API, Worker, Database, Cache, Queue
Container image references and port mappings
Deployments
Timeline-based deployment history with status icons
Filterable by status: In Progress, Succeeded, Failed, Rolled Back, Pending
Deployment details: version, target region, trigger type, duration, logs
Trigger types: Manual, Auto-Scale, Rollback, Scheduled
Success rate and summary statistics
Incidents
Expandable incident cards with full details
Severity levels: SEV1 (critical) through SEV4 (minor)
Status tracking: Investigating, Identified, Monitoring, Resolved
Affected services and region information
Timestamp tracking for creation and resolution
Metrics
Multi-metric dashboards: Requests/sec, Latency, Error Rate, CPU, Memory
Interactive SVG charts with per-region line graphs
Region filtering for focused analysis
Per-region breakdown cards with average and peak values
Mini-bar visualizations for quick comparisons
24-hour time range with hourly snapshots
Technology Stack
Frontend: React 18 + TypeScript + Vite
Styling: Tailwind CSS with a custom dark theme
Icons: Lucide React
Backend: Bolt Database (PostgreSQL + Row Level Security)
Data Visualization: Custom SVG charts and sparklines
Architecture
The platform uses a single-tenant schema with five core tables:

regions — Global deployment regions with coordinates, status, and health metrics
services — Deployable workloads with resource utilization tracking
deployments — Deployment records with version, status, and audit logs
incidents — Incident tracking with severity, status, and affected services
metrics — Time-series metric snapshots for charting and analysis
All tables have Row Level Security enabled with policies allowing public read/write access for the demo platform.

Design
The interface features a sophisticated dark theme inspired by enterprise infrastructure tooling:

Deep slate color palette with blue and cyan accents
Consistent 8px spacing system
Smooth fade-in transitions between views
Animated world map with pulsing region markers
Responsive layout from mobile to desktop with collapsible sidebar
Custom SVG sparklines and charts for data visualization
Status badges with color-coded dots and borders
Live clock in the header with UTC display
Getting Started
The project runs automatically on the Bolt platform — no manual setup required. The Bolt Database is pre-provisioned and seeded with sample data across 8 global regions.

Project Structure

src/
├── components/      Reusable UI components (Sidebar, Topbar, badges, charts)
├── hooks/          Data-fetching hooks for each table
├── lib/            Bolt Database client, types, and theme configuration
├── views/          Page-level views (Dashboard, Regions, Services, etc.)
├── App.tsx         Root component with view routing
├── main.tsx        Entry point
└── index.css       Global styles and animations
