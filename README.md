# Product Management System

A simple product management app with authentication built with Next.js and Supabase.

## Features

- User authentication (login/register/logout)
- Product CRUD operations
- Search and pagination
- Protected routes

## Tech Stack

- Next.js 16 + TypeScript
- Supabase (Database & Auth)
- TanStack Query
- React Hook Form
- shadcn/ui + Tailwind CSS

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/kiraascoder/bss-parking-test.git
cd bss-parking-test
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to finish setting up
3. Go to **Project Settings > API**
4. Copy your **Project URL** and **anon/public key**

### 4. Setup environment variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace `your_supabase_url_here` and `your_supabase_anon_key_here` with your actual Supabase credentials.

### 5. Setup database

Go to your Supabase project, open the **SQL Editor**, and run this:

```sql
-- Create products table
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  slug text unique not null,
  price double precision not null check (price > 0),
  image text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable Row Level Security
alter table products enable row level security;

-- Allow anyone to view products
create policy "Anyone can view products"
  on products for select
  using (true);

-- Allow users to create their own products
create policy "Users can create products"
  on products for insert
  with check (auth.uid() = user_id);

-- Allow users to update their own products
create policy "Users can update products"
  on products for update
  using (auth.uid() = user_id);

-- Allow users to delete their own products
create policy "Users can delete products"
  on products for delete
  using (auth.uid() = user_id);
```

### 6. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Register** a new account at `/register`
2. **Login** with your credentials at `/login`
3. Go to `/products` to manage products
4. **Create** new products
5. **Edit** or **Delete** your products

## Project Structure

```
src/
├── app/               # Next.js pages
├── components/        # React components
├── lib/              # Utilities and configs
├── services/         # API services
└── types/            # TypeScript types
```

