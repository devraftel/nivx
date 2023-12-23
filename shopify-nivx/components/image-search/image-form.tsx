'use client';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { z } from 'zod';

import darksetAvatar from '../../public/darksetAvatar.png';
import lightsetAvatar from '../../public/lightsetAvatar.png';
import { Form, FormControl, FormField, FormItem, FormMessage } from 'components/ui/form';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { useProductsStore } from 'components/store/searched-product-store';
import { useVoiceStore } from 'components/store/gemini-voice-output-store';

const imageSchema = z.any();

const defaultImageSchema = z.union([z.string(), z.null(), z.undefined()]);

export const SetImageValidator = z.object({
  image: z.union([imageSchema, defaultImageSchema])
});

export type SetImageRequest = z.infer<typeof SetImageValidator>;

export const FindImageForm = () => {
  const { setProducts } = useProductsStore();
  const { setVoice } = useVoiceStore();

  const form = useForm<SetImageRequest>({
    resolver: zodResolver(SetImageValidator),
    defaultValues: {
      image: undefined
    }
  });

  const { isSubmitting } = form.formState;

  const watchPhoto = form.watch('image');

  const onSubmit = async (value: SetImageRequest) => {
    try {
      const formData = new FormData();
      if (!value.image) {
        toast.error('Please upload image');
        return;
      }
      formData.append('image', value.image);

      const response = await fetch(`/api/image-search/`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        toast.error('Failed to save UserInfo.');
        return;
      }
      let newData = await response.json();

      if (!newData) {
        toast.error('Failed Image Search!');
        return;
      }

      setProducts(newData.products);
      setVoice(newData.response);

      toast.success('Image Search Completed!');
    } catch (error: any) {
      return {
        error:
          (error as { message: string }).message ||
          'An unexpected error occurred. Please try again later.'
      };
    }
  };

  const onRemoveImage = () => {
    form.setValue('image', '');
    form.setError('image', {
      type: 'manual',
      message: ''
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, onBlur } }) => (
            <FormItem>
              <FormControl>
                <label className="cursor-pointer py-8">
                  <div className="flex items-center justify-center ">
                    {watchPhoto ? (
                      <div className="relative ">
                        <Image
                          src={URL.createObjectURL(watchPhoto)}
                          alt="image"
                          width={80}
                          height={80}
                          className="h-24 w-24 rounded-sm object-cover"
                        />
                        <Button
                          onClick={onRemoveImage}
                          size={'icon'}
                          className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-50 hover:bg-red-300 hover:text-red-900 dark:bg-red-800 dark:hover:bg-red-700 dark:hover:text-red-100"
                        >
                          <Trash2 className="rounded-full " size={12} />
                        </Button>
                      </div>
                    ) : (
                      <Defaultimage />
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onBlur={onBlur}
                    onChange={(e) => {
                      if (!e.target.files || e.target.files.length === 0) {
                        form.resetField('image');
                      } else if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        if (file.size > 2 * 1024 * 1024) {
                          form.setError('image', {
                            type: 'manual',
                            message: 'File size should be less than 2 MB'
                          });
                          toast.error('File size should be less than 2 MB');
                        } else if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                          form.setError('image', {
                            type: 'manual',
                            message: 'File should be of type png, jpeg, or jpg'
                          });
                          toast.error('File should be of type png, jpeg, or jpg');
                        } else {
                          onChange(e.target.files[0]);
                        }
                      }
                    }}
                  />
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-6 w-full" type="submit" size={'sm'} disabled={isSubmitting}>
          {isSubmitting ? 'Searching...' : 'Image Search'}
        </Button>
      </form>
    </Form>
  );
};

const Defaultimage = () => (
  <>
    <Image
      src={lightsetAvatar}
      alt={'Upload Image'}
      width={80}
      height={80}
      className="flex h-20 w-20 rounded-sm object-cover dark:hidden"
    />
    <Image
      src={darksetAvatar}
      alt={'Upload Image'}
      width={80}
      height={80}
      className="hidden h-20 w-20 rounded-sm object-cover dark:flex"
    />
  </>
);
