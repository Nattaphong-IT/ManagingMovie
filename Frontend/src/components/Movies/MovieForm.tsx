import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CreateMovieRequest } from '@/types/movie.types';
import { Loader2 } from 'lucide-react';

interface MovieFormProps {
  onSubmit: (data: CreateMovieRequest) => Promise<void>;
  initialData?: Partial<CreateMovieRequest>;
  isEditing?: boolean;
  loading?: boolean;
}

export const MovieForm: React.FC<MovieFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateMovieRequest>({
    defaultValues: {
      title: initialData?.title || '',
      yearReleased: initialData?.yearReleased || new Date().getFullYear(),
      rating: initialData?.rating || 'G',
    },
  });

  const rating = watch('rating');

  const handleFormSubmit = async (data: CreateMovieRequest) => {
    await onSubmit(data);  // 🔗 ต่อ backend: onSubmit → createMovie / updateMovie
  };

  return (
    <Card className="bg-surface border border-muted max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">
          {isEditing ? 'Edit Movie' : 'Add New Movie'}
        </CardTitle>
      </CardHeader>

      <CardContent className="bg-surface p-6 space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Movie Title */}
          <div className="space-y-1">
            <Label htmlFor="title" className="text-text">
              Movie Title
            </Label>
            <Input
              id="title"
              placeholder="Enter movie title"
              className={`bg-backgroundEnd text-text placeholder-muted border border-${
                errors.title ? 'destructive' : 'muted'
              }`}
              {...register('title', {
                required: 'Movie title is required',
                minLength: {
                  value: 1,
                  message: 'Title must be at least 1 character',
                },
                maxLength: {
                  value: 255,
                  message: 'Title must be less than 255 characters',
                },
              })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Year Released */}
          <div className="space-y-1">
            <Label htmlFor="yearReleased" className="text-text">
              Year Released
            </Label>
            <Input
              id="yearReleased"
              type="number"
              min={1888}
              max={new Date().getFullYear() + 5}
              placeholder="e.g., 2024"
              className={`bg-backgroundEnd text-text placeholder-muted border border-${
                errors.yearReleased ? 'destructive' : 'muted'
              }`}
              {...register('yearReleased', {
                required: 'Year is required',
                min: { value: 1888, message: 'Year must be 1888 or later' },
                max: {
                  value: new Date().getFullYear() + 5,
                  message: `Year must be ${new Date().getFullYear() + 5} or earlier`,
                },
                valueAsNumber: true,
              })}
            />
            {errors.yearReleased && (
              <p className="text-sm text-destructive">
                {errors.yearReleased.message}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="space-y-1">
            <Label htmlFor="rating" className="text-text">
              Rating
            </Label>
            <Select
              value={rating}
              onValueChange={(val) => setValue('rating', val as any)}
            >
              <SelectTrigger
                className={`bg-backgroundEnd text-text border border-${
                  errors.rating ? 'destructive' : 'muted'
                }`}
              >
                <SelectValue placeholder="Select a rating" />
              </SelectTrigger>
              <SelectContent className="bg-surface text-text">
                {['G', 'PG', 'M', 'MA', 'R'].map((r) => (
                  <SelectItem key={r} value={r}>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                          r === 'G'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : r === 'PG'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                            : r === 'M'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                            : r === 'MA'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                            : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}
                      >
                        {r}
                      </div>
                      <span className="text-text">
                        {{
                          G: 'General Audiences',
                          PG: 'Parental Guidance',
                          M: 'Mature',
                          MA: 'Mature Accompanied',
                          R: 'Restricted',
                        }[r]}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-accent text-text"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-text" />
              ) : null}
              {isEditing ? 'Update Movie' : 'Add Movie'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border border-muted text-text hover:text-accent"
              onClick={() => window.history.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};