import api from '@/lib/axios';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';

interface IForm {
  email: string;
  password: string;
  repeatPassword: string;
}

export default function SignUp() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<IForm>();
  const onSubmit: SubmitHandler<IForm> = async ({ email, password }) => {
    try {
      await api.post('/auth/register', { email, password });

      // или можно пойти напрямую на бэкенд, если не нужен промежуточный API‑роут:
      // await api.post('/auth/login', { email, password });

      router.push('/sign-in');
    } catch {}
  };

  return (
    <div>
      Регистрация
      <form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue="email" {...register('email')} />

        <input {...register('password', { required: true })} />
        <input {...register('repeatPassword', { required: true })} />

        <input type="submit" />
      </form>
    </div>
  );
}
