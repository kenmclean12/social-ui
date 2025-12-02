export interface UserWithCountsResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  age: number;
  followingCount: number;
  followerCount: number;

  phoneNumber?: string;
  email: string;
  description?: string;
  avatarUrl?: string;
}
