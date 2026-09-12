import { Suspense } from "react";
import { LoginForm } from "@/components/school/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md pb-16">
      <span className="chip chip-sky">School dashboard</span>
      <h1 className="mt-3 font-display text-[32px] leading-tight tracking-tight md:text-[40px]">
        Sign in to manage your school.
      </h1>
      <p className="mt-2 text-sm text-[color:var(--color-ink-mute)]">
        For schools with a claimed profile on EarlyDays.
      </p>
      <Suspense fallback={<div className="mt-6 h-6 animate-pulse rounded bg-[color:var(--color-cream-deep)]" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
