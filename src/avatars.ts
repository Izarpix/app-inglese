import type { ImageSource } from 'expo-image';

export type AvatarId = `london-avatar-${string}`;

export type Avatar = { id: AvatarId; label: string; source: ImageSource };

export const AVATARS: Avatar[] = [
  { id: 'london-avatar-01', label: 'London learner 1', source: require('@/assets/images/avatars/london-avatar-01.png') },
  { id: 'london-avatar-02', label: 'London learner 2', source: require('@/assets/images/avatars/london-avatar-02.png') },
  { id: 'london-avatar-03', label: 'London learner 3', source: require('@/assets/images/avatars/london-avatar-03.png') },
  { id: 'london-avatar-04', label: 'London learner 4', source: require('@/assets/images/avatars/london-avatar-04.png') },
  { id: 'london-avatar-05', label: 'London learner 5', source: require('@/assets/images/avatars/london-avatar-05.png') },
  { id: 'london-avatar-06', label: 'London learner 6', source: require('@/assets/images/avatars/london-avatar-06.png') },
  { id: 'london-avatar-07', label: 'London learner 7', source: require('@/assets/images/avatars/london-avatar-07.png') },
  { id: 'london-avatar-08', label: 'London learner 8', source: require('@/assets/images/avatars/london-avatar-08.png') },
  { id: 'london-avatar-09', label: 'London learner 9', source: require('@/assets/images/avatars/london-avatar-09.png') },
  { id: 'london-avatar-10', label: 'London learner 10', source: require('@/assets/images/avatars/london-avatar-10.png') },
  { id: 'london-avatar-11', label: 'London learner 11', source: require('@/assets/images/avatars/london-avatar-11.png') },
  { id: 'london-avatar-12', label: 'London learner 12', source: require('@/assets/images/avatars/london-avatar-12.png') },
  { id: 'london-avatar-13', label: 'London learner 13', source: require('@/assets/images/avatars/london-avatar-13.png') },
  { id: 'london-avatar-14', label: 'London learner 14', source: require('@/assets/images/avatars/london-avatar-14.png') },
  { id: 'london-avatar-15', label: 'London learner 15', source: require('@/assets/images/avatars/london-avatar-15.png') },
];

export function avatarFor(id?: string | null): Avatar {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0];
}

export function randomAvatarId(): AvatarId {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)].id;
}
