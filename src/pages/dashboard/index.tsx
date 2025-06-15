import api from '@/lib/axios';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Dashboard() {
  const router = useRouter();

  const handleTestRequest = async () => {
    try {
      await api.get('/data/test');
    } catch {}
  };

  const handleLogoutButtonClick = async () => {
    try {
      await api.post('/auth/logout');
      router.push('/sign-in');
    } catch {}
  };

  useEffect(() => {
    handleTestRequest();
  }, []);

  return (
    <div>
      авторизованная зона <button onClick={handleLogoutButtonClick}>Логаут</button>
    </div>
  );
}
