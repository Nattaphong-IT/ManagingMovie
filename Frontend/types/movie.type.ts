export interface Movie {
  id: string;
  title: string;
  yearReleased: number;
  rating: 'G' | 'PG' | 'M' | 'MA' | 'R';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMovieRequest {
  title: string;
  yearReleased: number;
  rating: 'G' | 'PG' | 'M' | 'MA' | 'R';
}
export type UpdateMovieRequest = Partial<CreateMovieRequest>;
//export interface UpdateMovieRequest extends Partial<CreateMovieRequest> {}
