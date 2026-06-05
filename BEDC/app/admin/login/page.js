import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <LoginForm
      role="admin"
      title="Admin dashboard access"
      subtitle="Login to review student registrations, program counts, and recent enquiries."
    />
  );
}
