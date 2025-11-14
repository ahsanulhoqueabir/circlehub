# CircleHub JnU 🎓

**A modern platform connecting JnU students through lost & found services, item sharing, and community building.**

CircleHub is a comprehensive campus community platform built specifically for Jagannath University students. It helps students connect, share resources, and assist each other by reporting lost items, sharing found items, and offering items they no longer need.

---

## ✨ Features

### 🔍 **Lost & Found System**

- Report lost items with detailed descriptions and photos
- Browse and search through found items posted by other students
- Advanced filtering by category, location, and date
- Real-time status updates (active, found, closed)
- Reward system for found items

### 📤 **Item Sharing**

- Share items you no longer need with fellow students
- Browse available shared items by category and condition
- Item condition tracking (new, like-new, good, fair)
- Direct contact with item owners

### 🛡️ **Secure Authentication**

- University email-based authentication
- Google OAuth integration
- Automatic profile creation with university verification
- Secure user sessions with Supabase Auth

### 🎨 **Modern User Experience**

- Beautiful dark and light theme support
- Fully responsive design for all devices
- Intuitive navigation and search functionality
- Real-time notifications system
- Advanced filtering and sorting options

### 👤 **User Management**

- Personalized user profiles
- My Items dashboard to track your posts
- Profile settings and preferences
- University verification system

---

## 🛠️ Tech Stack

### **Frontend**

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React Context API

### **Backend & Database**

- **Backend**: Supabase (BaaS)
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth with Google OAuth
- **Storage**: Supabase Storage (for images)
- **Real-time**: Supabase Realtime subscriptions

### **Development Tools**

- **Linting**: ESLint with Next.js config
- **Type Safety**: TypeScript with strict mode
- **Package Manager**: npm
- **Deployment**: Vercel (recommended)

### **Key Dependencies**

```json
{
  "@supabase/supabase-js": "^2.81.1",
  "@supabase/ssr": "^0.7.0",
  "@radix-ui/react-popover": "^1.1.15",
  "@radix-ui/react-select": "^2.2.6",
  "date-fns": "^4.1.0",
  "class-variance-authority": "^0.7.1",
  "tailwind-merge": "^3.4.0"
}
```

---

## 🗂️ Project Structure

```
campus-connect/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── items/         # Items CRUD operations
│   │   └── user/          # User profile operations
│   ├── auth/              # Auth pages (login, register, callback)
│   ├── found/             # Found items page
│   ├── lost/              # Lost items page
│   ├── share/             # Share items page
│   ├── my-items/          # User's items dashboard
│   ├── profile/           # User profile
│   ├── settings/          # App settings
│   └── notifications/     # Notifications page
├── components/            # Reusable React components
│   ├── found-items/       # Found items components
│   ├── lost-items/        # Lost items components
│   ├── share-items/       # Share items components
│   └── ui/                # Base UI components
├── contexts/              # React Context providers
├── lib/                   # Utilities and configurations
│   ├── mock-data/         # Mock data for development
│   └── supabase/          # Supabase client configuration
└── public/                # Static assets
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Cloud Console account (for OAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/ahsanulhoqueabir/circlehub.git
cd circlehub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment example file:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL commands from `supabase-setup.sql` in your Supabase SQL editor
3. Configure Google OAuth in Supabase Dashboard:
   - Go to Authentication > Providers > Google
   - Add your Google OAuth credentials
   - Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📊 Database Schema

### **Core Tables**

#### `profiles`

- User profiles linked to Supabase Auth
- University verification and student information
- Avatar and contact details

#### `lost_items`

- Lost item reports with detailed descriptions
- Category, location, and date tracking
- Status management (active, found, closed)
- Optional reward system

#### `found_items`

- Found item posts with photos and descriptions
- Location and category information
- Status tracking (available, claimed, returned)

### **Security Features**

- Row Level Security (RLS) enabled on all tables
- User-specific policies for data access
- Automatic profile creation on user signup
- Secure authentication with university email verification

---

## 🎯 Key Features Implementation

### **Advanced Search & Filtering**

- Real-time search across title and descriptions
- Multi-criteria filtering (category, location, date)
- Sorting options (newest, oldest, most relevant)

### **Image Management**

- Optimized image upload and storage
- Multiple image support for items
- Automatic image optimization
- Placeholder image fallbacks

### **Responsive Design**

- Mobile-first approach with Tailwind CSS
- Dark/light theme system
- Accessible UI components with Radix UI
- Cross-browser compatibility

### **Performance Optimizations**

- Next.js App Router for optimal loading
- Server-side rendering (SSR) and static generation
- Database indexing for fast queries
- Optimized image loading with Next.js Image

---

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Deploy on Other Platforms

- Update `next.config.ts` for your hosting provider
- Ensure environment variables are properly set
- Configure build settings for your platform

---

## 🤝 Contributing

We welcome contributions to CircleHub! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**CircleHub JnU** - Connecting students, building community.

For questions or support, please [open an issue](https://github.com/ahsanulhoqueabir/circlehub/issues).

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.io/)
- UI components from [Radix UI](https://radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for Jagannath University students**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
