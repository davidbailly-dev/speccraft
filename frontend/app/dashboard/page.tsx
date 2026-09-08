import Button from "@/components/ui/Button";
import { getCurrentUser } from "@/libs/api/user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/auth/login');
    }

    return (
        <Button
            type="button"
        >
            Se déconnecter
        </Button>
    );
}