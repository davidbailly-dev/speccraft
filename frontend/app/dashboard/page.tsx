import { getCurrentUser } from "@/libs/api/user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/auth/login');
    }

    return (
        <h1>Page d'accueil de /dashboard</h1>
    );
}