import { createSignal, Show, onMount, mergeProps } from "solid-js";
import { Icon } from '@iconify-icon/solid';
import { navigate } from "astro:transitions/client";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-zod";
import { z } from "zod";
import { supabaseBrowserClient } from "../../lib/supabase/client";
import { onboardingContext } from "../../stores/onboarding";
import { addRole } from "../../stores/roles";

interface RegisterFormProps {
    intent?: 'register' | 'enroll' | 'subscribe' | 'challenge' | 'event';
    details?: string;
}

const defaultProps: Partial<RegisterFormProps> = {
    intent: 'register',
    details: ''
};

type UsernameStatus = "notset" | "checking" | "available" | "unavailable";

const successButtonTexts = {
    register: 'Continue to Dashboard',
    enroll: 'Continue to Enrollment',
    subscribe: 'Complete Subscription',
    event: 'Register for Event',
    challenge: 'Go to Challenge'
};

const schema = z.object({
    username: z.string()
        .min(3, "Must be at least 3 characters")
        .max(20, "Must be at most 20 characters")
        .regex(/^[a-zA-Z0-9_.]+$/, "Only letters, numbers, _ and . allowed"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Must be at least 8 characters")
        .regex(/[A-Z]/, "Needs at least one uppercase letter")
        .regex(/[a-z]/, "Needs at least one lowercase letter")
        .regex(/[0-9]/, "Needs at least one number")
        .regex(/[^A-Za-z0-9]/, "Needs at least one special character"),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export default function RegisterForm(incomingProps: RegisterFormProps) {
    const props = mergeProps(defaultProps, incomingProps);
    const [isSuccess, setIsSuccess] = createSignal(false);
    const [usernameStatus, setUsernameStatus] = createSignal<UsernameStatus>("notset");
    const [authError, setAuthError] = createSignal<string | null>(null);
    const supabase = supabaseBrowserClient;

    onMount(() => {
        onboardingContext.set({
            intent: props.intent || 'register',
            details: props.details || ''
        });
    });

    const { form, errors, data, isSubmitting, isValid, touched } = createForm({
        extend: validator({ schema }),
        onSubmit: async (values) => {
            setAuthError(null);
            if (usernameStatus() !== "available") {
                setAuthError("Please choose an available username");
                return;
            }

            try {
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: values.email,
                    password: values.password,
                });

                if (authError) throw authError;

                if (authData.user) {
                    await supabase.from("user_profiles").insert({
                        user_id: authData.user.id,
                        username: values.username
                    });

                    const { data } = await addRole({
                        user_id: authData.user.id,
                        role_id: 1,
                        role_name: "base_user"
                    })
                }

                setIsSuccess(true);
            } catch (error) {
                console.error("Registration error:", error);
                setAuthError("Registration failed. Please try again.");
            }
        }
    });

    const checkUsername = async (username: string) => {
        if (username.length < 3) {
            setUsernameStatus("notset");
            return;
        }

        setUsernameStatus("checking");
        try {
            const { data, error } = await supabase
                .from("user_profiles")
                .select("username")
                .eq("username", username)
                .maybeSingle();

            if (error) throw error;
            if (data) {
                setUsernameStatus("unavailable");
            } else {
                setUsernameStatus("available");
            }

        } catch (error) {
            console.error("Username check error:", error);
        }
    };

    // Success button click handler
    const handleSuccessNavigation = () => {

        if ((props.intent === 'enroll' || props.intent === 'subscribe' || props.intent === 'event') && !props.details) {
            console.error('Missing required details for', props.intent);
            navigate('/dashboard');
            return;
        }

        switch (props.intent) {
            case 'enroll':
            case 'subscribe':
            case 'event':
                navigate(`/payments?intent=${props.intent}&details=${props.details}`);
                break;
            case 'challenge':
                navigate(`/challenges/${props.details}`);
                break;
            case 'register':
            default:
                navigate('/dashboard');
        }
    };

    return (
        <div class="card w-full md:w-96 lg:w-1/4 bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 class="card-title text-2xl font-bold mb-4">
                    {isSuccess() ? "Account Created!" : "Register"}
                </h2>

                <Show when={!isSuccess()}>
                    <form use:form class="flex flex-col gap-4">

                        {/* Username Field */}
                        <div class="form-control">
                            <label class="input w-full">
                                <Icon icon="mdi:account" width="20" height="20" />
                                <input
                                    type="text"
                                    name="username"
                                    class="px-2 grow"
                                    placeholder="username"
                                    autocomplete="off"
                                    onBlur={(e) => checkUsername(e.currentTarget.value)}
                                />
                                {usernameStatus() === "checking" ?
                                    <span class="loading loading-spinner loading-sm text-primary"></span> :
                                    usernameStatus() === "available" ?
                                        <Icon icon="mdi:check-bold" class="text-success" /> :
                                        usernameStatus() === "unavailable" ?
                                            <Icon icon="mdi:close-circle-outline" class="text-error" /> : null
                                }
                            </label>
                            <Show when={errors().username && touched().username}>
                                <span class="text-error text-xs mt-1">{errors().username}</span>
                            </Show>
                            <Show when={usernameStatus() === "unavailable" && touched().username}>
                                <span class="text-error text-xs mt-1">Username is already taken</span>
                            </Show>
                        </div>

                        {/* Email Field */}
                        <div class="form-control">
                            <label class="input w-full">
                                <Icon icon="mdi:alternate-email" width="20" height="20" />
                                <input
                                    name="email"
                                    type="email"
                                    class="grow px-2"
                                    autocomplete="email"
                                    placeholder="your@email.com"
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

                        {/* Confirm Password Field */}
                        <div class="form-control">
                            <label class="input w-full">
                                <Icon icon="mdi:key-variant" width="20" height="20" />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    class="grow px-2"
                                    placeholder="••••••••"
                                />
                                <Show when={errors().confirmPassword && touched().confirmPassword}>
                                    <Icon icon="mdi:close-circle-outline" class="text-error" />
                                </Show>
                                <Show when={!errors().confirmPassword && touched().confirmPassword}>
                                    <Icon icon="mdi:check-bold" class="text-success" />
                                </Show>
                            </label>
                            <Show when={errors().confirmPassword && touched().confirmPassword}>
                                <span class="text-error text-xs mt-1">{errors().confirmPassword}</span>
                            </Show>
                        </div>

                        {/* Form-level errors - always show if present */}
                        <Show when={authError()}>
                            <div class="alert alert-error">
                                <Icon icon="mdi:alert-circle" />
                                <span>{authError()}</span>
                            </div>
                        </Show>

                        <button
                            class="btn btn-primary mt-4"
                            type="submit"
                            disabled={!isValid() || isSubmitting() || usernameStatus() !== "available"}
                        >
                            {isSubmitting() ? (
                                <>
                                    <span class="loading loading-spinner"></span>
                                    Creating account...
                                </>
                            ) : "Register"}
                        </button>
                    </form>
                </Show>

                {/* Success state remains the same */}
                <Show when={isSuccess()}>
                    <div class="flex flex-col items-center text-center">
                        <div class="text-5xl mb-4">🎉</div>
                        <p class="text-lg mb-6">Your account has been created!</p>
                        <button
                            class="btn btn-primary w-full"
                            onClick={handleSuccessNavigation}
                        >
                            {successButtonTexts[props.intent || 'register']}
                        </button>
                    </div>
                </Show>

            </div>
        </div>
    );
}