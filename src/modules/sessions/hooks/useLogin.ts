import { LoginFormValues } from './../components/LoginForm';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/react';

const useLogin = () => {
  const router = useRouter();

  const login = async (values: LoginFormValues) => {
    router.prefetch('/');
    await signIn('credentials', {
      email: values?.email,
      password: values?.password,
      redirect: false,
    }).then(res => {
      if (res?.error) {
        toast.error('Đăng nhập thất bại, email hoặc mật khẩu không chính xác');
      } else {
        toast.success('Đăng nhập thành công');
        router.refresh();
      }
    });
  };

  return {
    login,
  };
};

export default useLogin;
