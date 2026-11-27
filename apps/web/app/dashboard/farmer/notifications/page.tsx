import { redirect } from 'next/navigation';

// Notifications are shared across roles
export default function FarmerNotificationsRedirect() {
  redirect('/dashboard/notifications');
}
