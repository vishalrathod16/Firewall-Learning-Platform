# WAF Simulator

An interactive Web Application Firewall Simulator that helps users understand and test WAF concepts.

## Features

- Interactive WAF testing environment
- Real-time attack simulation
- Visual feedback and analytics
- Code editor integration
- Dark theme UI

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

## Running the Application

### Development Mode

To run both the server and client in development mode:

```bash
npm run dev:full
```

This will start:

- Server on http://localhost:3001
- Client on http://localhost:3000

### Production Mode

1. Build the client:
   ```bash
   cd client
   npm run build
   ```
2. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3001
NODE_ENV=development
```

## License

MIT
