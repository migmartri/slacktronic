# Slacktronic - Repository Report

## Overview

**Slacktronic** is a desktop application that bridges Slack workspaces with hardware controllers (primarily Arduino devices via serial communication). It enables physical hardware to react to Slack events in real-time, creating interactive physical notifications and displays.

**Version:** 0.2.0
**License:** Apache-2.0
**Author:** Miguel Martinez
**Status:** Work in progress under heavy development

## Architecture & Components

The project consists of three main components:

### 1. **Client Application** (`/client`)
- **Technology:** Electron-based desktop app with React + Redux
- **Purpose:** Main user interface and bridge between Slack and hardware
- **Key Features:**
  - Cross-platform support (macOS, Windows, Linux)
  - Real-time Slack message monitoring
  - Serial communication with Arduino devices
  - System tray integration
  - Auto-updates support

### 2. **OAuth Server** (`/oauthserver`)
- **Technology:** Go (Golang) microservice
- **Purpose:** Handles Slack OAuth authentication flow
- **Deployment:** Dockerized service
- **Features:**
  - HTTPS enforcement option
  - SSL/TLS support behind load balancers
  - Stateless authentication handling

### 3. **Hardware Devices** (`/devices`)
- **Technology:** Arduino sketches (.ino files)
- **Purpose:** Physical device implementations
- **Current Examples:**
  - LED control system (turns LEDs on/off based on serial input)

## Technology Stack

### Frontend/Desktop
- **Electron 2.0.4** - Desktop application framework
- **React 16.2** - UI library
- **Redux** - State management
- **Redux Saga** - Side effects management
- **Ant Design (antd)** - UI component library
- **Webpack 3** - Module bundler
- **Babel** - JavaScript transpiler
- **Flow** - Static type checking

### Backend (OAuth Server)
- **Go 1.10.x**
- **golang.org/x/oauth2** - OAuth2 implementation
- **Docker** - Containerization

### Hardware Communication
- **SerialPort** (Node.js) - Serial communication library
- **Baud Rate:** 57600

### Development & Build Tools
- **Yarn** - Package management
- **Travis CI** - Continuous integration
- **Electron Builder** - Application packaging
- **ESLint** - Code linting
- **Jest** - Testing framework
- **Spectron** - E2E testing for Electron

## Key Features

### Slack Integration
The application connects to Slack via the **@slack/client** SDK and monitors various real-time events:

1. **Triggers Available:**
   - **Mentions** - Detects when user is @mentioned
   - **Direct Messages** - Monitors DM activity
   - **Channel Messages** - Tracks channel-specific messages
   - **Away Status** - Monitors user presence/away status

2. **Event Processing:**
   - Uses Slack RTM (Real-Time Messaging) API
   - Tracks message read/unread status
   - Filters events based on user configuration

### Hardware Actions
When Slack triggers fire, the app can send commands to connected hardware via serial port:

- **Serial Communication:** Sends formatted messages to Arduino devices
- **Configurable Actions:** User-defined responses to Slack events
- **Multiple Device Support:** Can manage multiple serial devices

### Example Use Cases
- Turn on an LED when mentioned in Slack
- Display messages on an LCD panel
- Control servo motors based on channel activity
- Create physical notifications for important messages

## How It Works

1. **Authentication Flow:**
   - User initiates OAuth with Slack via the OAuth server
   - Server exchanges OAuth code for access token
   - Token stored securely in electron-store

2. **Event Monitoring:**
   - App connects to Slack RTM API
   - Listens for configured trigger events (mentions, DMs, etc.)
   - Evaluates trigger conditions (e.g., is message unread?)

3. **Action Execution:**
   - When trigger fires, app determines appropriate action
   - Sends command via serial port to connected Arduino
   - Arduino executes physical action (LED, servo, etc.)

## Development & Deployment

### Development Setup
```bash
cd client
yarn
yarn run dev
```

### Building for Production
```bash
# Build for all platforms (macOS, Windows, Linux)
yarn package-all

# Platform-specific builds
yarn package-linux
yarn package-win
```

### OAuth Server Deployment
```bash
# Docker deployment
docker run -p 8080:8080 \
  -e OAUTH_CLIENT_SECRET=secret \
  -e OAUTH_CLIENT_ID=myID \
  migmartri/slacktronic-auth
```

### CI/CD Pipeline
- **Travis CI** builds on both macOS (Electron app) and Linux (Go server)
- Automated testing, linting, and packaging
- Releases distributed via GitHub releases

## Project Structure

```
slacktronic/
├── client/                    # Electron/React desktop app
│   ├── app/
│   │   ├── actions/          # Redux actions
│   │   ├── components/       # React components
│   │   ├── containers/       # Redux containers
│   │   ├── integrations/     # Slack & Serial integrations
│   │   │   ├── slack/       # Slack RTM triggers
│   │   │   └── serialCom/   # Serial port communication
│   │   ├── reducers/        # Redux reducers
│   │   ├── sagas/           # Redux sagas
│   │   └── main.dev.js      # Electron main process
├── oauthserver/              # Go OAuth microservice
│   ├── main.go
│   ├── Dockerfile
│   └── Gopkg.toml
└── devices/                  # Arduino sketches
    └── arduino/
        └── LEDs/            # LED control example
```

## Current Status

- **Active Development:** Project marked as work in progress
- **Latest Release:** v0.2.0
- **Recent Activity:**
  - Vulnerability fixes
  - MacOS tray icon improvements
  - Copy/paste functionality fixes
  - New initialization mode
- **Platform Support:** macOS, Windows, Linux (via Electron)

## Potential Use Cases

1. **Office Notifications:** Physical alerts for important Slack messages
2. **Status Indicators:** LED-based team availability displays
3. **Message Displays:** LCD panels showing recent messages
4. **Interactive Dashboards:** Physical controls for Slack interactions
5. **IoT Integration:** Bridge between Slack and smart home devices

---

This project represents an innovative intersection of software communication platforms and physical computing, enabling creative ways to visualize and interact with Slack messages through hardware interfaces.
