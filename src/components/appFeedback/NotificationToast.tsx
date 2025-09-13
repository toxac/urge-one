// src/components/appFeedback/NotificationToast.tsx
import { useStore } from '@nanostores/solid';
import { notificationStore, removeNotification } from '../../stores/notifications';
import { For } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

export default function NotificationToast() {
    const notifications = useStore(notificationStore);

    const getToastClass = (type: string) => {
        switch (type) {
            case 'success':
                return 'alert-success';
            case 'error':
                return 'alert-error';
            case 'warning':
                return 'alert-warning';
            case 'info':
                return 'alert-info';
            default:
                return '';
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return (
                    <Icon icon="mdi:success-circle" width={24} height={24} class="text-success" />
                );
            case 'error':
                return (
                    <Icon icon="mdi:error" width={24} height={24} class="text-error" />
                );
            case 'warning':
                return (
                    <Icon icon="mdi:warning" width={24} height={24} class="text-warning" />
                );
            case 'info':
                return (
                    <Icon icon="mdi:information" width={24} height={24} class="text-info" />
                );
            default:
                return null;
        }
    };

    const getPositionClass = (position: string = 'bottom-center') => {
        switch (position) {
            case 'top-right':
                return 'toast-top toast-end';
            case 'top-left':
                return 'toast-top toast-start';
            case 'top-center':
                return 'toast-top toast-center';
            case 'bottom-left':
                return 'toast-bottom toast-start';
            case 'bottom-right':
                return 'toast-bottom toast-end';
            case 'bottom-center':
            default:
                return 'toast-bottom toast-end';
        }
    };

    // Group notifications by position
    const notificationsByPosition = () => {
        const groups: Record<string, any[]> = {};
        notifications().forEach(notification => {
            const position = notification.position || 'bottom-center';
            if (!groups[position]) {
                groups[position] = [];
            }
            groups[position].push(notification);
        });
        return groups;
    };

    return (
        <>
            <For each={Object.entries(notificationsByPosition())}>
                {([position, positionNotifications]) => (
                    <div class={`toast z-50 ${getPositionClass(position)}`}>
                        <For each={positionNotifications}>
                            {(notification) => (
                                <div
                                    class={`alert alert-base-200 shadow-lg mb-2 transition ease-in-out duration-500`}
                                    role="alert"
                                    aria-live="polite"
                                >
                                    {getIcon(notification.type)}
                                    <div class="text-neutral">
                                        {notification.title && <p class="font-bold">{notification.title}</p>}
                                        <div class="text-xs">{notification.message}</div>
                                    </div>
                                    <button
                                        class="btn btn-neutral btn-outline btn-circle btn-sm"
                                        onClick={() => removeNotification(notification.id!)}
                                        aria-label="Close notification"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </For>
                    </div>
                )}
            </For>
        </>
    );
}