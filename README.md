# LogisticApp Customer Application

A modern, responsive customer application built with Nuxt 4 for managing shipments, tracking packages, and handling support tickets in the logistics platform.

## Features

### 🚀 **Core Functionality**
- **User Authentication** - Secure registration and login system
- **Shipment Management** - Create, track, and manage shipments
- **Real-time Tracking** - Track shipments by tracking number
- **Support System** - Create and manage support tickets
- **Profile Management** - Update user profile and preferences

### 🎨 **User Experience**
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern UI** - Clean, professional interface
- **Progressive Web App** - Installable and offline-capable

### 🔧 **Technical Features**
- **TypeScript** - Full type safety
- **Server-Side Rendering** - Fast initial page loads
- **API Integration** - Seamless backend connectivity
- **Form Validation** - Real-time form validation
- **Error Handling** - Comprehensive error handling

## Technology Stack

- **Framework**: Nuxt 4 (Vue.js 3)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Authentication**: nuxt-auth-utils
- **HTTP Client**: Built-in $fetch
- **Icons**: Heroicons
- **Build Tool**: Vite

## API Integration

The application integrates with a FastAPI backend at `/api/v1/`:

- **Authentication**: `/auth/login`, `/auth/register`
- **Users**: `/users/me`
- **Shipments**: `/shipments/`, `/shipments/{id}`
- **Tracking**: `/tracking/{tracking_number}`
- **Tickets**: `/tickets/`, `/tickets/{id}`
- **Pickup Points**: `/pickup-points/`

## Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
