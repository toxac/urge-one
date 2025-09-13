import { createSignal, Show } from "solid-js";
import { Icon } from '@iconify-icon/solid';
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-zod";
import { z } from "zod";
import { navigate } from "astro:transitions/client";
import { supabaseBrowserClient } from "../../lib/supabase/client";

const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
});

export default function LoginForm() {
    const [authError, setAuthError] = createSignal<string | null>(null);
    const [isSuccess, setIsSuccess] = createSignal(false);
    const supabase = supabaseBrowserClient;

    const { form, errors, isSubmitting, isValid, touched } = createForm({
        extend: validator({ schema }),
        onSubmit: async (values) => {
            setAuthError(null);

            try {
                const { error } = await supabase.auth.signInWithPassword({
                    email: values.email,
                    password: values.password
                });

                if (error) throw error;

                setIsSuccess(true);
                navigate('/dashboard'); // Redirect on success
            } catch (error) {
                console.error("Login error:", error);
                setAuthError("Login failed. Please try again.");
            }
        }
    });

    return (
        <div class="card w-full md:w-96 bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title text-2xl font-bold mb-4">
                    {isSuccess() ? "Login Successful!" : "Login"}
                </h2>

                <Show when={!isSuccess()}>
                    <form use:form class="flex flex-col gap-4">
                        {/* Email Field */}
                        <div class="form-control">
                            <label class="input w-full">
                                <Icon icon="mdi:alternate-email" width="20" height="20" />
                                <input
                                    name="email"
                                    type="email"
                                    class="grow px-2"
                                    placeholder="your@email.com"
                                    autocomplete="email"
                                />
                                <Show when={errors().email && touched().email}>
                                    <Icon icon="mdi:close-circle-outline" class="text-error" />
                                </Show>
                                <Show when={!errors().email && touched().email}>
                                    <Icon icon="mdi:check-bold" class="text-success" />
                                </Show>
                            </label>
                            <Show when={errors().email && touched().email}>
                                <span class="text-error text-xs mt-1">{errors().email}</span>
                            </Show>
                        </div>

                        {/* Password Field */}
                        <div class="form-control">
                            <label class="input w-full">
                                <Icon icon="mdi:key-variant" width="20" height="20" />
                                <input
                                    name="password"
                                    type="password"
                                    class="grow px-2"
                                    placeholder="••••••••"
                                    autocomplete="current-password"
                                />
                                <Show when={errors().password && touched().password}>
                                    <Icon icon="mdi:close-circle-outline" class="text-error" />
                                </Show>
                                <Show when={!errors().password && touched().password}>
                                    <Icon icon="mdi:check-bold" class="text-success" />
                                </Show>
                            </label>
                            <Show when={errors().password && touched().password}>
                                <span class="text-error text-xs mt-1">{errors().password}</span>
                            </Show>
                        </div>

                        {/* Auth Error */}
                        <Show when={authError()}>
                            <div class="alert alert-error">
                                <Icon icon="mdi:alert-circle" />
                                <span>{authError()}</span>
                            </div>
                        </Show>

                        <button
                            class="btn btn-primary mt-4"
                            type="submit"
                            disabled={!isValid() || isSubmitting()}
                        >
                            {isSubmitting() ? (
                                <>
                                    <span class="loading loading-spinner"></span>
                                    Logging in...
                                </>
                            ) : 'Login'}
                        </button>
                    </form>
                </Show>

                <Show when={isSuccess()}>
                    <div class="flex flex-col items-center text-center">
                        <div class="text-5xl mb-4">👋</div>
                        <p class="text-lg mb-6">Redirecting to dashboard...</p>
                        <button
                            class="btn btn-primary w-full"
                            onClick={() => navigate('/dashboard')}
                        >
                            Continue to Dashboard
                        </button>
                    </div>
                </Show>

                <div class="divider">OR</div>

                <div class="text-center">
                    <a href="/auth/register" class="link link-primary">
                        Don't have an account? Register
                    </a>
                    <br />
                    <a href="/auth/forgot-password" class="link link-secondary">
                        Forgot password?
                    </a>
                </div>
            </div>
        </div>
    );
}