import { createSignal,Show } from 'solid-js'
import { useAuth } from '../../lib/hooks/useAuth'
import { navigate } from 'astro:transitions/client'

interface Props {
  resetPasswordCode: string
}

export default function ResetPasswordForm(props: Props) {
    const { resetPassword, error, clearError } = useAuth()
    const [password, setPassword] = createSignal('')
    const [confirmPassword, setConfirmPassword] = createSignal('')
    const [message, setMessage] = createSignal('')
    const [loading, setLoading] = createSignal(false)
    const [success, setSuccess] = createSignal(false)


    const handleSubmit = async (e: Event) => {
        e.preventDefault()
        setMessage('')
        clearError && clearError()
        
        // Validate passwords match
        if (password() !== confirmPassword()) {
            setMessage('Passwords do not match.')
            return
        }

        // Validate password strength
        if (password().length < 6) {
            setMessage('Password must be at least 6 characters long.')
            return
        }

        setLoading(true)
        
        try {
            const result = await resetPassword(props.resetPasswordCode, password())

            if (result.success) {
                setSuccess(true)
                setMessage(result.message || 'Password updated successfully!')
                // Clear form
                setPassword('')
                setConfirmPassword('')
            } else {
                setMessage(result.error || 'An error occurred while resetting your password.')
            }
        } catch (err: any) {
            setMessage(err.message || 'An error occurred while resetting your password.')
        } finally {
            setLoading(false)
        }
    }

    const goToLogin = () => {
        navigate('/auth/login')
    }

    return (
        <div class="card w-96 bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title">Reset Password</h2>

                <Show when={success()}>
                    <div class="alert alert-success">
                        <span>{message()}</span>
                    </div>
                    <div class="form-control mt-6">
                        <button
                            onClick={goToLogin}
                            class="btn btn-primary"
                        >
                            Back to Login
                        </button>
                    </div>
                </Show>

                <Show when={!success()}>
                    <form onSubmit={handleSubmit}>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">New Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                class="input input-bordered"
                                value={password()}
                                onInput={(e) => setPassword(e.currentTarget.value)}
                                required
                            />
                        </div>

                        <div class="form-control mt-4">
                            <label class="label">
                                <span class="label-text">Confirm New Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                class="input input-bordered"
                                value={confirmPassword()}
                                onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                                required
                            />
                        </div>

                        {error() && (
                            <div class="alert alert-error mt-4">
                                <span>{error()}</span>
                            </div>
                        )}

                        {message() && !success() && (
                            <div class="alert alert-error mt-4">
                                <span>{message()}</span>
                            </div>
                        )}

                        <div class="form-control mt-6">
                            <button
                                type="submit"
                                class="btn btn-primary"
                                disabled={loading()}
                            >
                                {loading() ? (
                                    <span class="loading loading-spinner"></span>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </div>
                    </form>
                </Show>

                <Show when={!success()}>
                    <div class="divider">OR</div>

                    <div class="text-center">
                        <a href="/auth/login" class="link link-primary">
                            Back to Login
                        </a>
                    </div>
                </Show>
            </div>
        </div>
    )
}