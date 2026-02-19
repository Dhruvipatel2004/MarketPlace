import notifee, { AndroidImportance, TimestampTrigger, TriggerType } from '@notifee/react-native';

class NotificationService {
    async initialize() {
        // Required for Android 13+ (API level 33)
        await notifee.requestPermission();

        // Create a channel (required for Android)
        await notifee.createChannel({
            id: 'orders',
            name: 'Orders & Updates',
            importance: AndroidImportance.HIGH,
            description: 'Notifications regarding your orders and status updates',
        });
    }

    async displayImmediateNotification(title: string, body: string, data?: any) {
        await notifee.displayNotification({
            title,
            body,
            data,
            android: {
                channelId: 'orders',
                importance: AndroidImportance.HIGH,
                pressAction: {
                    id: 'default',
                },
            },
        });
    }

    async scheduleNotification(title: string, body: string, delaySeconds: number, data?: any) {
        // Create a time-based trigger
        const date = new Date(Date.now() + delaySeconds * 1000);

        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: date.getTime(),
        };

        // Create the notification
        await notifee.createTriggerNotification(
            {
                title,
                body,
                data,
                android: {
                    channelId: 'orders',
                    importance: AndroidImportance.HIGH,
                    pressAction: {
                        id: 'default',
                    },
                },
            },
            trigger,
        );
    }
}

export const notificationService = new NotificationService();
