'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import MessageBox from '@/components/ui/MessageBox';
import { register } from '@/libs/api/auth';
import { RegisterResult } from '@/libs/api/types';

const initialState: RegisterResult = {
    success: false,
    reason: null,
    errors: [],
};

async function registerAction(_prevState: RegisterResult, formData: FormData): Promise<RegisterResult> {
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || typeof password !== 'string') {
        return { success: false, reason: 'invalid_input', errors: ['Champs invalides'] };
    }

    return register({ email, password });
}

export default function RegisterPage() {
    const router = useRouter();
    const [state, formAction, pending] = useActionState(registerAction, initialState);
    const [prevState, setPrevState] = useState(state);
    const [showMessageBox, setShowMessageBox] = useState<boolean>(state.success || state.errors.length > 0);

    if (state !== prevState) {
        setPrevState(state);
        setShowMessageBox(state.success || state.errors.length > 0);
    }

    useEffect(() => {
        if (state.success) {
            router.push('/');  // TODO: ajuster la destination post-register
        }
    }, [state, router]);

    return (
        <div>
            <h1>Créer un compte</h1>
            <form
                action={formAction}
                className="flex flex-col gap-4 p-6 rounded-lg bg-stone-900"
                onChange={() => setShowMessageBox(false)}
            >
                <Input
                    type="text"
                    name="email"
                    placeholder="Email"
                />
                <Input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                />
                <Button type="submit" disabled={pending}>Créer mon compte</Button>
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