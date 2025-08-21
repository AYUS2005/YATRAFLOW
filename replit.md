# Yatraflow - Real-time Traffic Alert System

## Overview

Yatraflow is a real-time traffic alert system built as a full-stack web application. The application allows users to view traffic incidents (accidents, traffic jams, hazards) on an interactive map interface and report new alerts to help other users navigate better. The system features a modern React frontend with a clean, mobile-responsive design and an Express.js backend with RESTful APIs for alert management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom theme variables and responsive design
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful APIs with structured error handling
- **Data Storage**: Currently using in-memory storage with Map data structures (designed for easy migration to persistent database)
- **Request Handling**: JSON-based request/response with proper validation using Zod schemas

### Database Schema
The application defines two main entities using Drizzle ORM:
- **Users**: Basic user management with username/password authentication
- **Alerts**: Traffic incidents with type (accident/traffic/hazard), location coordinates, description, and timestamps
- **Database**: Configured for PostgreSQL with Drizzle as the ORM layer

### Key Features
- **Real-time Alert Display**: Interactive map showing traffic incidents with color-coded markers
- **Alert Filtering**: Filter alerts by type (accidents, traffic, hazards)
- **Mobile-First Design**: Responsive interface with mobile navigation and touch-friendly interactions
- **Alert Reporting**: Modal interface for users to submit new traffic alerts
- **Real-time Status**: Connection status indicator and notification system

### API Endpoints
- `GET /api/alerts` - Retrieve all alerts
- `GET /api/alerts/type/:type` - Filter alerts by specific type
- `POST /api/alerts` - Create new alert (with validation)
- `DELETE /api/alerts/:id` - Remove specific alert

### Development Setup
- **Development Server**: Vite dev server with HMR for frontend
- **Backend**: Express server with request logging and error handling
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Path Aliases**: Configured aliases for clean imports (@/, @shared/, etc.)

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: PostgreSQL database driver for serverless environments
- **drizzle-orm** & **drizzle-kit**: Type-safe ORM and migration tools
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React routing library
- **zod**: Schema validation for API requests and responses

### UI Components
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **shadcn/ui**: Pre-built component library built on Radix UI
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe utility for managing component variants
- **lucide-react**: Icon library for consistent iconography

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Replit integration for development

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx** & **tailwind-merge**: Utility for conditional class names
- **nanoid**: Unique ID generation
- **react-hook-form** & **@hookform/resolvers**: Form management with validation