'use client';

import { useRouter } from "next/navigation";
import { logout } from "@/libs/api/auth";
import Button from "./Button";

export default function LogoutButton() {
    const router = useRouter();

    async function logoutUser() {
        const res = await logout();

        if (res.success) {
            router.push('/auth/login');
        }
    }

    return (
        <Button
            type="button"
            onClick={logoutUser}
        >
            Se déconnecter
        </Button>
    );
}