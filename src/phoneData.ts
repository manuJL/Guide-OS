import { Contact, GalleryPhoto } from './types';

export const contacts: Contact[] = [
  { id: 'alex', name: 'Alex', avatar: '👤', lastMessage: 'See you tomorrow!', time: '10:30', unread: 0 },
  { id: 'priya', name: 'Priya', avatar: '👩', lastMessage: 'Thanks for the help', time: '9:15', unread: 2 },
  { id: 'raj', name: 'Raj Kumar', avatar: '👨', lastMessage: 'Good morning!', time: 'Yesterday', unread: 0 },
  { id: 'meera', name: 'Meera', avatar: '👩‍🦱', lastMessage: 'Photo received ✓', time: 'Yesterday', unread: 0 },
  { id: 'amit', name: 'Amit', avatar: '🧑', lastMessage: 'Let\'s meet at 5', time: 'Monday', unread: 1 },
];

export const galleryPhotos: GalleryPhoto[] = [
  { id: 'gallery-photo-1', color: '#e74c3c', label: '🌅', gradient: 'linear-gradient(135deg, #e74c3c, #f39c12)' },
  { id: 'gallery-photo-2', color: '#3498db', label: '🏔️', gradient: 'linear-gradient(135deg, #3498db, #2ecc71)' },
  { id: 'gallery-photo-3', color: '#9b59b6', label: '🌸', gradient: 'linear-gradient(135deg, #9b59b6, #e91e63)' },
  { id: 'gallery-photo-4', color: '#2ecc71', label: '🌿', gradient: 'linear-gradient(135deg, #2ecc71, #1abc9c)' },
  { id: 'gallery-photo-5', color: '#f39c12', label: '🌻', gradient: 'linear-gradient(135deg, #f39c12, #e67e22)' },
  { id: 'gallery-photo-6', color: '#1abc9c', label: '🏖️', gradient: 'linear-gradient(135deg, #1abc9c, #3498db)' },
];

export function getAllGalleryPhotos(): GalleryPhoto[] {
  return galleryPhotos;
}