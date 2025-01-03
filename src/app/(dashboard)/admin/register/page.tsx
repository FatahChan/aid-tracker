import RegisterForm from '@/components/register/register-form'


export default function AdminRegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8 px-4 py-8">
                <RegisterForm roleSelectable />
            </div>
        </div>
    )
}
