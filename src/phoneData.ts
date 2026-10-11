import { Contact, GalleryPhoto } from './types';

export const contacts: Contact[] = [
  { id: 'alex', name: 'Alex', avatar: '🅐', lastMessage: 'See you tomorrow!', time: '10:30', unread: 0 },
  { id: 'priya', name: 'Priya', avatar: '🅟', lastMessage: 'Thanks for the help', time: '9:15', unread: 2 },
  { id: 'raj', name: 'Raj Kumar', avatar: '🅡', lastMessage: 'Good morning!', time: 'Yesterday', unread: 0 },
  { id: 'meera', name: 'Meera', avatar: '🅜', lastMessage: 'Photo received ✓', time: 'Yesterday', unread: 0 },
  { id: 'amit', name: 'Amit', avatar: '🅐', lastMessage: 'Let\'s meet at 5', time: 'Monday', unread: 1 },
];

type SceneId = 'sunset' | 'peaks' | 'blossom' | 'forest' | 'meadow' | 'shore';

export const galleryPhotos: GalleryPhoto[] = [
  { id: 'gallery-photo-1', color: '#e74c3c', label: '🌅', gradient: 'linear-gradient(135deg, #fa7c47, #f5b26b)', scene: 'sunset' },
  { id: 'gallery-photo-2', color: '#3498db', label: '🏔️', gradient: 'linear-gradient(135deg, #4f7be0, #37b6a8)', scene: 'peaks' },
  { id: 'gallery-photo-3', color: '#9b59b6', label: '🌸', gradient: 'linear-gradient(135deg, #c86dd7, #f06292)', scene: 'blossom' },
  { id: 'gallery-photo-4', color: '#2ecc71', label: '🌿', gradient: 'linear-gradient(135deg, #2ba55d, #2fbf9f)', scene: 'forest' },
  { id: 'gallery-photo-5', color: '#f39c12', label: '🌻', gradient: 'linear-gradient(135deg, #f2a93c, #eb6f3c)', scene: 'meadow' },
  { id: 'gallery-photo-6', color: '#1abc9c', label: '🏖️', gradient: 'linear-gradient(135deg, #2bb8b3, #4f8fe0)', scene: 'shore' },
];

export function getAllGalleryPhotos(): GalleryPhoto[] {
  return galleryPhotos;
}