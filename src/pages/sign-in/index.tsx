import api from '@/lib/axios';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';

interface IForm {
  email: string;
  password: string;
}

export default function SignIn() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<IForm>();
  const onSubmit: SubmitHandler<IForm> = async ({ email, password }) => {
    try {
      // Если ты оставил API‑роут /api/auth/login:
      await api.post('/auth/login', { email, password });

      // или можно пойти напрямую на бэкенд, если не нужен промежуточный API‑роут:
      // await api.post('/auth/login', { email, password });

      router.push('/dashboard');
    } catch {
      alert('Ошибка входа');
    }
  };

  return (
    <div>
      Авторизация
      <form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue="email" {...register('email')} />

        <input {...register('password', { required: true })} />

        <input type="submit" />
      </form>
    </div>
  );
}
