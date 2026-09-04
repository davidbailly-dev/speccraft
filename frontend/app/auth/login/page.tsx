'use client';

import { useEffect, useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';

import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import MessageBox from '@/components/ui/MessageBox';
import { login } from '@/libs/api/auth';
import { LoginResult } from '@/libs/api/types';

const initialState: LoginResult = {
    success: false,
    reason: null,
    errors: [],
};

async function loginAction(_prevState: LoginResult, formData: FormData): Promise<LoginResult> {
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
        return { success: false, reason: 'invalid_credentials', errors: ['Champs invalides'] };
    }

    return login({ email, password });
}

export default function LoginPage() {
    const router = useRouter();
    const [state, formAction, pending] = useActionState(loginAction, initialState);
    const [prevState, setPrevState] = useState(state);
    const [showMessageBox, setShowMessageBox] = useState<boolean>(state.success || state.errors.length > 0);

    if (state !== prevState) {
        setPrevState(state);
        setShowMessageBox(state.success || state.errors.length > 0);
    }

    useEffect(() => {
        if (state.success) {
            router.push('/'); // TODO: ajuster la destination post-login
        }
    }, [state, router]);

    return (
        <div>
            <h1>Se connecter</h1>
            <form
                action={formAction}
                className="flex flex-col gap-4 p-6 rounded-lg bg-stone-900"
                onChange={() => setShowMessageBox(false)}
            >
                <Input type="text" name="email" placeholder="Email" />
                <Input type="password" name="password" placeholder="Mot de passe" />
                <Button type="submit" disabled={pending}>Se connecter</Button>
            </form>
            { showMessageBox &&
                <MessageBox
                    className="mt-2 whitespace-pre-line"
                    type={state.success ? 'success' : 'error'}
                    message={state.success ? '' : state.errors.join('\n')}
                />
            }
        </div>
    );
}