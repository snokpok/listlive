import { serverConfigs } from '@/common/configs';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import Image from 'next/image';
import AppLogo from '@/public/listlive-icon.png';

export const registerSchema = Yup.object().shape({
    email: Yup.string()
        .required('Please enter your email')
        .email('Must be a valid email'),
    password: Yup.string().required('Please enter your password'),
});

export default function RegisterForm() {
    const router = useRouter();
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        },
        validationSchema: registerSchema,
        onSubmit: async (values, actions) => {
            const response = await toast.promise(
                axios({
                    url: `${serverConfigs.backend_dev}/auth/register`,
                    method: 'post',
                    data: {
                        email: values.email,
                        password: values.password,
                        first_name: values.firstName,
                        last_name: values.lastName,
                    },
                }),
                {
                    loading: 'Creating your account...',
                    success: 'Successfully created account',
                    error: 'Account associated with email already exists; please register with a unique email',
                },
                {
                    position: 'bottom-left',
                },
            );
            if (response.data.token) {
                document.cookie = `t=${response.data.token}; path=/`;
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
                Create an account
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
                    type="text"
                    placeholder="First name"
                    name="firstName"
                    onChange={formik.handleChange}
                    className={`w-10/12 rounded-lg border-gray-300 focus:border-black focus:ring-1 focus:outline-none`}
                />
                <input
                    type="text"
                    placeholder="Last name"
                    name="lastName"
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
                    Register
                </button>
                <a
                    onClick={(e) => {
                        e.preventDefault();
                        router.push('/login');
                    }}
                    className="underline text-blue-500 cursor-pointer"
                >
                    Login instead
                </a>
            </form>
        </div>
    );
}
