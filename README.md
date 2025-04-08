# Next.js + Payload CMS Starter

A modern, full-stack starter template for building web applications with Next.js and Payload CMS.

## 🚀 Features

- **Next.js 14** with App Router for the frontend
- **Payload CMS** for content management
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **pnpm** for fast, disk-space efficient package management
- **Modern UI** with Shadcn UI components
- **Authentication** built-in with Payload CMS
- **API Routes** for backend functionality
- **Environment Variables** for configuration
- **Docker** support for development and production

## 📁 Project Structure

The project follows a monorepo structure:

- `apps/web`: Next.js frontend application
- `apps/cms`: Payload CMS backend
- `packages`: Shared utilities and configurations

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Payload CMS](https://payloadcms.com/) - Headless CMS
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - UI component library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [pnpm](https://pnpm.io/) - Package manager
- [Docker](https://www.docker.com/) - Containerization

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm
- Docker (optional)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

To run the application in development mode:

```bash
# Start the development server
pnpm dev

# Or run specific apps
pnpm dev:web    # Start Next.js frontend
pnpm dev:cms    # Start Payload CMS
```

### Building

To build the application for production:

```bash
# Build all apps
pnpm build

# Or build specific apps
pnpm build:web  # Build Next.js frontend
pnpm build:cms  # Build Payload CMS
```

## 🌐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URI=mongodb://localhost/your-database

# Payload CMS
PAYLOAD_SECRET=your-secret-key
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_CMS_URL=http://localhost:3001
```

## 📱 Features

- **Content Management**: Create and manage content through Payload CMS
- **Authentication**: Built-in user authentication and authorization
- **API Routes**: RESTful API endpoints for data access
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Modern UI**: Beautiful components with Shadcn UI

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Payload CMS team for the powerful headless CMS
- Tailwind CSS team for the utility-first CSS framework
- Shadcn UI team for the beautiful components
