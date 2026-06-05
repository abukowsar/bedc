import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default function UserLoginPage() {
  return (
    <LoginForm
      role="user"
      title="User dashboard access"
      subtitle="Login to view student program updates, tracks, and registration guidance."
    />
  );
}
