import LoginForm from "@/components/auth/LoginForm";
import AuthPageShell from "@/components/auth/AuthPageShell";

export const dynamic = "force-static";

export default function LoginPage() {
    return (
        <AuthPageShell
            badge="Account"
            title={<>Log in to Your <span>Portal</span></>}
            subtitle="Manage submissions, credits, saved newsroom stories, and digest preferences in one place."
        >
            <LoginForm />
        </AuthPageShell>
    );
}
