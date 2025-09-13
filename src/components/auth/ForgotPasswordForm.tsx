import { createSignal } from 'solid-js'
import { useAuth } from '../../lib/hooks/useAuth'

export default function ForgotPasswordForm() {
    const { forgotPassword, auth, error } = useAuth()
    const [email, setEmail] = createSignal('')
    const [message, setMessage] = createSignal('')

    const handleSubmit = async (e: Event) => {
        e.preventDefault()
        setMessage('')

        const result = await forgotPassword(email())

        if (result.success) {
            setMessage(result.message || 'Password reset email sent!')
        }
    }

    return (
        <div class="card w-96 bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">Forgot Password</h2>

                <form onSubmit={handleSubmit}>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            class="input input-bordered"
                            value={email()}
                            onInput={(e) => setEmail(e.currentTarget.value)}
                            required
                        />
                    </div>

                    {error() && (
                        <div class="alert alert-error">
                            <span>{error()}</span>
                        </div>
                    )}

                    {message() && (
                        <div class="alert alert-success">
                            <span>{message()}</span>
                        </div>
                    )}

                    <div class="form-control mt-6">
                        <button
                            type="submit"
                            class="btn btn-primary"
                            disabled={auth().loading}
                        >
                            {auth().loading ? (
                                <span class="loading loading-spinner"></span>
                            ) : (
                                'Send Reset Email'
                            )}
                        </button>
                    </div>
                </form>

                <div class="divider">OR</div>

                <div class="text-center">
                    <a href="/auth/login" class="link link-primary">
                        Back to Login
                    </a>
                </div>
            </div>
        </div>
    )
}