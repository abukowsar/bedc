import SetPasswordForm from "@/components/SetPasswordForm";

export const dynamic = "force-dynamic";

export default async function SetPasswordPage({ searchParams }) {
  const params = await searchParams;
  return <SetPasswordForm token={params?.token || ""} />;
}
