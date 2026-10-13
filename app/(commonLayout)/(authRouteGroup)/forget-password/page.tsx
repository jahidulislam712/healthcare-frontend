
import { ForgetPasswordForm } from "@/components/modules/auth/ForgetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forget Password",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgetPasswordForm />
      </div>
    </div>
  );
}
