# SmartForm AI

AI-powered self-learning form builder platform.

## Overview

SmartForm AI is a modern, scalable form builder platform with advanced capabilities including:

- Drag and drop form builder
- AI-based form generation (Gemini API)
- Dynamic schema-driven form rendering
- Conditional logic and multi-step forms
- Analytics and self-learning system
- API-driven forms
- Conversational (chat-like) forms

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (to be added)
- **AI Integration**: Google Gemini API (future)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9 or later

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/           # Next.js App Router (pages, layouts)
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # API utilities, helpers
├── store/         # Global state (Zustand)
└── types/         # TypeScript types/interfaces
```

## Available Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start development server             |
| `npm run build`     | Build for production                 |
| `npm run start`     | Start production server              |
| `npm run lint`      | Run ESLint                           |
| `npm run lint:fix`  | Run ESLint with auto-fix             |
| `npm run format`    | Format code with Prettier            |
| `npm run type-check`| Run TypeScript type checking         |

## License

Private project - All rights reserved.
