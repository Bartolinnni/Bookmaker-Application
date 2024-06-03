import './SignIn.css';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignIn() {
    useEffect(() => {
        sessionStorage.clear();
    }, []);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        // Prevent the browser from reloading the page
        e.preventDefault();
        // Read the form data
        const form = e.currentTarget;
        const formData = new FormData(form);

        // Initialize formJson as an empty object
        const formJson: { [key: string]: any } = {};

        // Convert formData to JSON
        formData.forEach((value, key) => {
            formJson[key] = value;
        });

        // Send the fetch request with JSON payload
        fetch('/login', {
            method: form.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formJson)
        })
            .then(response => {
                // Handle response
                if (response.ok) {
                    response.json().then(data => {
                        sessionStorage.setItem('username', formJson["email"]);
                        sessionStorage.setItem('accessToken', data.accessToken);
                        sessionStorage.setItem('refreshToken', data.refreshToken);
                        toast.success("Successfully signed in!");
                        window.location.href = '/';
                    });
                } else {
                    console.log(response);
                    toast.error("Failed to sign in. Please check your email and password.");
                }
            })
            .catch(error => {
                // Handle fetch error
                console.error('Error:', error);
                toast.error("An error occurred. Please try again later.");
            });
    }

    return (
        <>
            <ToastContainer />
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit} method="POST">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full rounded-md py-1.5 bg-gray-800 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md py-1.5 bg-gray-800 text-white shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Not a member?{' '}
                        <a href="/userRegister" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                            Sign up for an account!
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
