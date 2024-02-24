export interface Profile {
  name: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  email: string | null;
  phone_number: string;
  profile_photo_path: string | null;
}