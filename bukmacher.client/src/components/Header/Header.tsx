import { Fragment, useState, useEffect } from 'react'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import { useLocation, useNavigate } from "react-router-dom";
import {
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const products = [
    { name: 'La Liga', description: 'Spanish Leauge', href: '#', icon: "https://flagcdn.com/es.svg" },
    { name: 'Premier Leauge', description: 'English Leauge', href: '#', icon: "https://flagcdn.com/gb-eng.svg" },
    { name: 'Seria A', description: 'Italian Leauge', href: '#', icon: "https://flagcdn.com/it.svg" },
    { name: 'Lige 1', description: 'French Leauge', href: '#', icon: "https://flagcdn.com/fr.svg" },
    { name: 'Ekstraklasa', description: 'Polish Leauge', href: '#', icon: "https://flagcdn.com/pl.svg" },
]
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [displayusername, displayusernameupdate] = useState('');
    const [showmenu, showmenuupdateupdate] = useState(false);
    const usenavigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === '/userLogin' || location.pathname === '/userRegister') {
            showmenuupdateupdate(false);
        } else {
            console.log(location.pathname);
            showmenuupdateupdate(true);
            let username = sessionStorage.getItem('username');
            if (username === '' || username === null) {
                console.log(username + "co za gówno");
                usenavigate('/userLogin');
            } else {
                displayusernameupdate(username);
                console.log(username+ "co za gówno jebane");
            }
        }

    }, [location])

    return (
        <div>
            {showmenu &&
            <header className="bg-gray-800">
                <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
                        </a>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </button>
                    </div>
                    <Popover.Group className="hidden lg:flex lg:gap-x-12">
                        <Popover className="relative">
                            <Popover.Button
                                className="flex items-center gap-x-1 font-semibold leading-6 text-2xl text-white">
                                Leagues
                                <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true"/>
                            </Popover.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel
                                    className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-gray-800 shadow-lg ring-1 ring-gray-900/5">
                                    <div className="p-4">
                                        {products.map((item) => (
                                            <div
                                                key={item.name}
                                                className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-700"
                                            >
                                                <div
                                                    className="flex h-11 w-11 flex-none items-center justify-center rounded-lg">
                                                    <img
                                                        src={item.icon}
                                                        className="h-8 w-15 text-gray-600 group-hover:text-indigo-600"
                                                        aria-hidden="true"/>
                                                </div>
                                                <div className="flex-auto">
                                                    <a href={item.href} className="block font-semibold text-white">
                                                        {item.name}
                                                        <span className="absolute inset-0"/>
                                                    </a>
                                                    <p className="mt-1 text-gray-400">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </Popover>

                        <a href="/profile" className="text-2xl font-semibold leading-6 text-white">
                            Profile
                        </a>
                        <a href="/individualBetHistory" className="text-2xl font-semibold leading-6 text-white">
                            Bets
                        </a>
                        <a href="/userGroups" className="text-2xl font-semibold leading-6 text-white">
                            Groups
                        </a>
                    </Popover.Group>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <a href="/userLogin" className="text-2xl font-semibold leading-6 text-white">
                            Log out <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </nav>
                <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                    <div className="fixed inset-0 z-10" />
                    <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <img
                                    className="h-8 w-auto"
                                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                    alt=""
                                />
                            </a>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    <Disclosure as="div" className="-mx-3">
                                        {({ open }) => (
                                            <>
                                                <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-2xl font-semibold leading-7 text-white hover:bg-gray-700">
                                                    Leauges
                                                    <ChevronDownIcon
                                                        className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 flex-none')}
                                                        aria-hidden="true"
                                                    />
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="mt-2 space-y-2">
                                                    {[...products].map((item) => (
                                                        <Disclosure.Button
                                                            key={item.name}
                                                            as="a"
                                                            href={item.href}
                                                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-white hover:bg-gray-700"
                                                        >
                                                            {item.name}
                                                        </Disclosure.Button>
                                                    ))}
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                    <a
                                        href="#"
                                        className="-mx-3 block rounded-lg px-3 py-2 text-2xl font-semibold leading-7 text-white hover:bg-gray-700"
                                    >
                                        Bets
                                    </a>
                                    <a
                                        href="/profile"
                                        className="-mx-3 block rounded-lg px-3 py-2 text-2xl font-semibold leading-7 text-white hover:bg-gray-700"
                                    >
                                        Profile
                                    </a>
                                    <p className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-700">
                                        Welcome <b>{displayusername}</b>!
                                    </p>
                                </div>
                                <div className="py-6">
                                    <a
                                        href="/userLogin"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-700"
                                    >
                                        Log out
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </header>
            }
        </div>
    )
}
