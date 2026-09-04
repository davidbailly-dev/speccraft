export default function AuthLayout({ children }: LayoutProps<"/auth">) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            {children}
        </div>
    );
}