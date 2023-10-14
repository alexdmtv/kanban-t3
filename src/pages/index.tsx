import Button from "@/components/button";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-center text-4xl font-bold">Welcome to Kanban App!</h1>
      <SignedIn>
        <Link href="/boards">
          <Button btnType="primary" size="L" className="px-8">
            Go to Boards
          </Button>
        </Link>
      </SignedIn>

      <SignedOut>
        <SignInButton>
          <Button btnType="primary" size="L" className="w-auto px-8">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
