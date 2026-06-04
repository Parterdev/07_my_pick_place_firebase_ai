export interface PlaceExperience {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  createdAt: number;
}