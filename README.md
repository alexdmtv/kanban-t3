# Example of a Kanban Board Application created with T3 stack

Welcome to my T3/Next.js Kanban Board application. It's a demonstration project created from scratch using the [Frontend Mentor figma design and images](https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB). 
I've used the T3 template, which is based on Next.js, TRPC, and Prisma.

I've also built this project with the Rails + Hotwire stack. You can find it [here](https://github.com/alexdmtv/rails-kanban).

## Features

* **Boards**: Create and manage multiple Kanban boards.
* **Lists** (Columns): Create lists to organize your tasks. Rearrange them by dragging.
* **Cards** (Tasks): Create tasks with descriptions. Rearrange them within or between lists by dragging.
* **Subtasks**: Add actionable subtasks to your main tasks for a more detailed level of granularity.
* **Drag & Drop**: Powered by dnd kit, offering a seamless user experience in organizing tasks and columns.
* **Authentication**: Powered by Clerk. Supports connecting multiple accounts, managing connected devices, and more.

## Technologies

* Next.js 13
* Clerk (authentication provider)
* Prisma (ORM)
* PostgreSQL
* Shadcn components (Radix based UI components library)
* Tailwind
* Zod (schema validation)
* TRPC (api layer)
* dnd kit (drag and drop functionality)
* Zustand (global state manager)
* React Hook Form

## Quick Start

1. Clone the repository.
2. Set up a Clerk account.
3. Set up PostgreSQL.
4. Copy and rename `.env.example` to `.env` and fill in the missing values.
5. Install JavaScript dependencies using `pnpm install`.
6. Run the `pnpm dev` script to start the development server.

This application is deployed and can be accessed at the following URL: https://t3-kanban-app.up.railway.app.