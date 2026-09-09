'use client';

import { useRouter } from "next/navigation";
import { logout } from "@/libs/api/auth";
import Button from "./Button";

interface LogoutButtonProps {
    className?: string,
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
    const router = useRouter();

    async function logoutUser() {
        const res = await logout();

        if (res.success) {
            router.push('/auth/login');
        }
    }

    return (
        <Button
            className={className}
            type="button"
            onClick={logoutUser}
        >
            Se déconnecter
        </Button>
    );
}