import { serverConfigs } from '@/common/configs';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { UserContext } from '@/common/contexts/user.context';
import Image from 'next/image';
import AppLogo from '@/public/listlive-icon.png';

export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .required('Please enter your email')
        .email('Must be a valid email'),
    password: Yup.string().required('Please enter your password'),
});

function LoginForm() {
    const router = useRouter();
    const userContext = React.useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: async (values, actions) => {
            const response = await toast.promise(
                axios({
                    url: `${serverConfigs.backend_dev}/auth/login`,
                    method: 'post',
                    data: values,
                }),

                {
                    loading: 'Logging you in...',
                    success: 'Successfully logged in',
                    error: 'Incorrect credentials',
                },
                {
                    position: 'bottom-left',
                },
            );
            if (response.data) {
                document.cookie = `t=${response.data.token}; path=/`;
                userContext.setUser((prev) => ({
                    ...prev,
                    token: response.data.token,
                    id: response.data.id,
                }));
                router.replace('/app');
            }
            actions.setSubmitting(false);
        },
    });

    return (
        <div className="bg-white flex flex-col space-y-2 shadow-2xl w-96 p-8 rounded-lg">
            <div className="flex flex-col items-center text-2xl font-bold">
                <div>
                    <Image
                        src={AppLogo}
                        width={40}
                        height={40}
                        onClick={() => {
                            router.replace('/');
                        }}
                        className="cursor-pointer"
                    />
                </div>
                Login to Listlive
            </div>
            <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col space-y-2 items-center"
            >
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={formik.handleChange}
                    className={`w-10/12 rounded-lg border-gray-300 focus:border-black focus:ring-1 focus:outline-none`}
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={formik.handleChange}
                    className={`w-10/12 rounded-lg border-gray-300 focus:border-black focus:ring-1 focus:outline-none`}
                />
                <button
                    type="submit"
                    className="bg-black text-white p-3 rounded-lg hover:opacity-80 transition"
                >
                    Login
                </button>
                <a
                    className="underline text-blue-500 cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        router.push('/register');
                    }}
                >
                    Register instead
                </a>
            </form>
        </div>
    );
}

export default LoginForm;
