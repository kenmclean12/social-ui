export interface PaginatedResponseDto<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}
