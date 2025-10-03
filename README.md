# Next.js Sanity E-commerce Starter

This is a high-performance, server-first e-commerce starter kit built with the Next.js App Router, Sanity.io, and Stripe. It's designed to be a modern, performant, and scalable foundation for your next e-commerce project.

## Core Technologies

-   **Framework:** Next.js (App Router)
-   **Styling:** Tailwind CSS v4
-   **UI Components:** shadcn/ui
-   **E-commerce Backend:** Stripe
-   **CMS:** Sanity.io
-   **Deployment:** Vercel

## Features

-   **Partial Prerendering (PPR):** Instant page loads with a static shell and streamed dynamic content.
-   **Stripe Integration:** Manage products in Stripe and use Stripe Checkout.
-   **Sanity.io Integration:** Store and manage product data and page content in Sanity.
-   **Automated Data Sync:** A Stripe webhook automatically syncs product data to Sanity.
-   **Vector Embeddings:** Automatically generates vector embeddings for products to enable semantic search.
-   **On-Demand Cache Invalidation:** Tag-based caching ensures fresh data without full rebuilds.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/next-sanity-ecommerce.git
cd next-sanity-ecommerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file by copying the `.env.local.example` file:

```bash
cp .env.local.example .env.local
```

Then, fill in the required environment variables in `.env.local`:

-   `STRIPE_SECRET_KEY`: Your Stripe secret key.
-   `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret.
-   `SANITY_API_TOKEN`: Your Sanity API token with write access.
-   `NEXT_PUBLIC_URL`: The public URL of your application (e.g., `http://localhost:3000` for local development).

### 4. Set up Sanity.io

Initialize a new Sanity project in the `sanity` directory:

```bash
cd sanity
npm create sanity@latest
cd ..
```

Follow the prompts to log in and create a new project. When asked about the schema, you can accept the defaults. The project is already configured to use the schemas in the `sanity/schemas` directory.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 6. Set up the Stripe Webhook

1.  In your Stripe dashboard, go to **Developers > Webhooks**.
2.  Click **Add an endpoint**.
3.  For the **Endpoint URL**, use `[YOUR_PUBLIC_URL]/api/stripe/webhook`. For local development, you can use a tool like [ngrok](https://ngrok.com/) to expose your local server to the internet.
4.  For the **Version**, select the latest API version.
5.  For the **Events to send**, select `product.created`, `product.updated`, and `product.deleted`.
6.  Click **Add endpoint**.
7.  Copy the webhook's **Signing secret** and add it to your `.env.local` file as `STRIPE_WEBHOOK_SECRET`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1.  Push your code to a Git repository.
2.  [Import your project](https://vercel.com/new) into Vercel.
3.  Set up the environment variables in the Vercel project settings.
4.  Deploy!