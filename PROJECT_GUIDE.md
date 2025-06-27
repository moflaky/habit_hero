# Habit Hero - Project Structure & Setup Guide

## 🎯 Project Overview

Habit Hero is a full-stack habit tracking application built with modern web technologies. The app allows users to create habits, track daily completions, view streaks, and monitor their progress over time.

## 📁 Complete Project Structure

```
habit_tracker/
├── .env                           # Environment variables (not committed)
├── .env.example                   # Environment variables template
├── .github/
│   └── copilot-instructions.md    # Copilot custom instructions
├── .next/                         # Next.js build output
├── .vscode/
│   └── tasks.json                 # VS Code tasks configuration
├── node_modules/                  # NPM dependencies
├── prisma/
│   ├── schema.prisma             # Database schema definition
│   └── seed/
│       └── seed.ts               # Database seeding script
├── public/                        # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── habits/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── completions/
│   │   │   │   │   │   └── route.ts    # Habit completion API
│   │   │   │   │   └── route.ts        # Individual habit API
│   │   │   │   └── route.ts            # Habits collection API
│   │   │   └── users/
│   │   │       ├── [id]/
│   │   │       │   └── route.ts        # Individual user API
│   │   │       └── route.ts            # Users collection API
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx               # Main application page
│   ├── components/
│   │   ├── CreateHabitForm.tsx    # Form for creating new habits
│   │   └── HabitCard.tsx          # Individual habit display component
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client configuration
│   │   └── utils.ts              # Utility functions (cn, etc.)
│   └── types/
│       └── index.ts              # TypeScript type definitions
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # NPM package configuration
├── package-lock.json             # NPM lock file
├── postcss.config.mjs            # PostCSS configuration
├── README.md                     # Project documentation
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🛠 Technology Stack

### Frontend
- **Next.js 14+** with App Router - React framework for production
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **clsx & tailwind-merge** - Conditional class name utilities

### Backend  
- **Next.js API Routes** - Server-side API endpoints
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Relational database

### Development Tools
- **ESLint** - Code linting and formatting
- **tsx** - TypeScript execution for seed scripts

## 🗄 Database Schema

### Models

1. **User**
   ```prisma
   model User {
     id        String   @id @default(cuid())
     name      String
     email     String   @unique
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     
     habits           Habit[]
     habitCompletions HabitCompletion[]
   }
   ```

2. **Habit**
   ```prisma
   model Habit {
     id          String   @id @default(cuid())
     title       String
     description String?
     userId      String
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
     
     user        User              @relation(fields: [userId], references: [id])
     completions HabitCompletion[]
   }
   ```

3. **HabitCompletion**
   ```prisma
   model HabitCompletion {
     id       String   @id @default(cuid())
     habitId  String
     userId   String
     date     DateTime @db.Date
     createdAt DateTime @default(now())
     
     habit Habit @relation(fields: [habitId], references: [id])
     user  User  @relation(fields: [userId], references: [id])
     
     @@unique([habitId, userId, date])
   }
   ```

## 🚀 API Endpoints

### Habits
- `GET /api/habits?userId={id}` - Get all habits for a user
- `POST /api/habits` - Create a new habit
- `GET /api/habits/[id]` - Get a specific habit
- `PATCH /api/habits/[id]` - Update a habit
- `DELETE /api/habits/[id]` - Delete a habit

### Habit Completions
- `POST /api/habits/[id]/completions` - Mark habit as complete for a date
- `DELETE /api/habits/[id]/completions` - Remove habit completion

### Users
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get user with habits

## 🎨 UI Components

### HabitCard
- Displays individual habit information
- Shows weekly completion grid
- Tracks current streak
- Allows toggling completion status
- Edit and delete functionality

### CreateHabitForm
- Form for creating new habits
- Title and description fields
- Validation and loading states

## 📦 Key Features Implemented

1. **Habit Management**
   - Create, read, update, delete habits
   - Add optional descriptions

2. **Daily Tracking**
   - Mark habits as complete for any date
   - Visual weekly completion grid
   - Toggle completion status

3. **Progress Monitoring**
   - Current streak calculation
   - Success rate percentage
   - Daily completion statistics

4. **Modern UI/UX**
   - Responsive design
   - Beautiful gradient backgrounds
   - Interactive animations
   - Loading states

## 🔧 Setup Commands

```bash
# Install dependencies
npm install

# Set up database
npm run db:migrate

# Seed with sample data
npm run db:seed

# Start development server
npm run dev

# Build for production
npm run build

# Reset database (useful for development)
npm run db:reset
```

## 🌱 Sample Data

The seed script creates:
- 1 demo user (`demo-user-1`)
- 5 sample habits:
  - Drink 8 glasses of water
  - Read for 30 minutes
  - Exercise for 30 minutes
  - Meditate for 10 minutes
  - Write in journal
- Random completions for the past week

## 🚀 Deployment Options

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms
- Ensure PostgreSQL database is available
- Set `DATABASE_URL` environment variable
- Run migrations: `npx prisma migrate deploy`
- Build and deploy: `npm run build && npm start`

## 🔑 Environment Variables

Required environment variables (see `.env.example`):

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/habit_hero_db"

# Next.js (optional)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

## 🎯 Next Steps & Enhancements

Potential features to add:
- User authentication
- Edit habit functionality
- Monthly/yearly views
- Habit categories
- Achievement badges
- Data export
- Mobile app (React Native)
- Social features
- Habit templates

This project provides a solid foundation for a production-ready habit tracking application!
