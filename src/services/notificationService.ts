import notifee from '@notifee/react-native';

export const onDisplayNotification = async ({
  title = '',
  body = '',
}: {
  title?: string;
  body?: string;
}) => {
  const channelId = await notifee.createChannel({
    id: 'channelId',
    name: 'channelName',
  });

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId,
    },
  });
};
