export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: 'G' | 'PG' | 'M' | 'MA' | 'R';
  createdBy?: { _id: string; name: string } | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMovieRequest {
  title: string;
  year: number;
  rating: 'G' | 'PG' | 'M' | 'MA' | 'R';
}
export type UpdateMovieRequest = Partial<CreateMovieRequest>;
//export interface UpdateMovieRequest extends Partial<CreateMovieRequest> {}
