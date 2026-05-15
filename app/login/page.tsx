import LoginForm from "@/components/auth/LoginForm";

/**
 * Keep this page synchronous (no `await searchParams`). With a `?next=` query, a dynamic
 * server page can stream the RSC slot after the shell, so users briefly saw only header/footer.
 * `LoginForm` reads `next` / `bookmark` from the URL on the client in `useLayoutEffect`.
 */
export const dynamic = "force-static";

export default function LoginPage() {
    return <LoginForm />;
}
