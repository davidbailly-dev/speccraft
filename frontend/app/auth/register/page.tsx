import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RegisterPage() {
    return (
        <div>
            <h1>Créer un compte</h1>
            <form
                action=""
                className="flex flex-col gap-4 p-6 rounded-lg bg-stone-900"
            >
                <Input
                    type="text"
                    name="email"
                    placeholder="Email"
                />
                <Input
                    type="text"
                    name="password"
                    placeholder="Mot de passe"
                />
                <Button
                    type="submit"
                    label="Créer mon compte"
                />
            </form>
        </div>
    );
}