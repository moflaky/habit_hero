# Habit Hero 🎯

A modern, full-stack habit tracking application built with Next.js, TypeScript, PostgreSQL, and Prisma.

## Features

- ✅ Create, update, and delete habits
- 📅 Mark habits as complete for specific dates
- 📊 View weekly habit completion grid
- 🔥 Track current streaks
- 📈 Monitor success rates and statistics
- 🎨 Beautiful, responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Lucide React
- **Styling**: Tailwind CSS + clsx for conditional classes
- **Date Handling**: date-fns

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── habits/          # Habit CRUD operations
│   │   └── users/           # User management
│   └── page.tsx             # Main application page
├── components/
│   ├── CreateHabitForm.tsx  # Form for creating new habits
│   └── HabitCard.tsx        # Individual habit display component
├── lib/
│   ├── prisma.ts           # Prisma client configuration
│   └── utils.ts            # Utility functions
└── types/
    └── index.ts            # TypeScript type definitions

prisma/
├── schema.prisma           # Database schema
└── seed/
    └── seed.ts            # Database seeding script
```

## Database Schema

### User
- `id` (String, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Habit
- `id` (String, Primary Key)
- `title` (String)
- `description` (String, Optional)
- `userId` (String, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### HabitCompletion
- `id` (String, Primary Key)
- `habitId` (String, Foreign Key)
- `userId` (String, Foreign Key)
- `date` (Date)
- `createdAt` (DateTime)
- Unique constraint: one completion per habit per day per user

## API Routes

### Habits
- `GET /api/habits?userId={id}` - Get all habits for a user
- `POST /api/habits` - Create a new habit
- `GET /api/habits/[id]` - Get a specific habit
- `PATCH /api/habits/[id]` - Update a habit
- `DELETE /api/habits/[id]` - Delete a habit

### Habit Completions
- `POST /api/habits/[id]/completions` - Mark habit as complete
- `DELETE /api/habits/[id]/completions` - Remove habit completion

### Users
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get user with habits

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd habit_tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database connection string:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/habit_hero_db?schema=public"
   ```

4. **Set up the database**
   ```bash
   # Run database migrations
   npm run db:migrate
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:seed` - Seed the database with sample data
- `npm run db:reset` - Reset database and re-seed

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/habit_hero_db?schema=public"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Make sure to:
1. Set up a PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build and deploy the application

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database management with [Prisma](https://prisma.io/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
