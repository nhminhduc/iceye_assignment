# ICEYE Assignment

A modern web application built with React and TypeScript, featuring a robust architecture and comprehensive feature set.

## Project Overview

This application provides a feature-rich web interface with the following capabilities:

- User authentication and authorization
- Dashboard with data visualization
- Profile management with password change functionality
- Acquisition management panel
- Responsive and modern UI using Ant Design components

## _LARVIS_ improvements

For _LARVIS_ improvements, see the [backend README](/backend/README.md).

## Tech Stack

### Core Technologies

- **React 19** - Latest version of the React library
- **TypeScript** - For type-safe development
- **Vite** - Next-generation frontend tooling

### Key Libraries

- **@tanstack/react-query** - For efficient data fetching and state management
- **@tanstack/react-router** - Type-safe routing solution
- **Ant Design (antd)** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Jotai** - Primitive and flexible state management
- **Axios** - HTTP client

### Development Tools

- **ESLint** - Code linting with TypeScript support
- **Vitest** - Unit testing framework
- **Testing Library** - React component testing utilities

## Setup Instructions

### Prerequisites

- Node.js (>= 18.x)
- pnpm (preferred package manager)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

### Installation

```bash
# Install dependencies
pnpm install
```

## Running Locally

### Development Mode

```bash
# Start the development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### Using Docker Compose

```bash
# Build and start all services
docker compose up -d --build
```

The application will be available at `http://localhost:3000`

## Building for Production

```bash
# Create a production build
pnpm build

# Preview the production build locally
pnpm preview
```

## Important Notes & TODOs

Current limitations and areas for improvement:

- Dark mode support pending implementation
- Extended error handling needed in some areas
- API rate limiting implementation to be added
- Additional unit tests coverage required
- Form validation enhancements planned

## Future Improvements

### Planned Features

1. **Role-Based Access Control (RBAC)**

   - Implement fine-grained user permissions
   - Role management interface
   - Access control matrices

2. **Performance Optimizations**

   - Implement caching strategy tuning
   - Code splitting optimization
   - Bundle size reduction

3. **Enhanced User Experience**

   - Improved responsive design
   - Accessibility enhancements
   - Offline mode support

4. **Security Enhancements**

   - Implement refresh token mechanism
   - Add rate limiting
   - Enhanced password policies
   - Security headers configuration

5. **Developer Experience**

   - Improved documentation
   - Streamlined CI/CD pipeline
   - Enhanced development tooling

6. **Testing and Quality Assurance**

   - Increase unit test coverage
   - Implement end-to-end testing
   - Continuous integration setup

7. **Monitoring and Analytics**

   - Integrate application performance monitoring
   - User behavior analytics
   - Error tracking and reporting

8. **Deployment and Hosting**

   - Explore deployment options (Github Pages, Vercel, etc.)
   - CI/CD pipeline for automated deployments
   - Container orchestration with Kubernetes
   - Multi-cloud deployment strategy
