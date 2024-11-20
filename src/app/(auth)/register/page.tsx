import { registerAction } from '@/components/register/actions/registerAction'
import RegisterForm from '@/components/register/register-form'


export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md space-y-8 px-4 py-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your credentials to access your account
                    </p>
                </div>
                <RegisterForm onSubmit={async (values) => {
                    "use server"
                    registerAction(values)
                }} />
            </div>
        </div>
    )
}
