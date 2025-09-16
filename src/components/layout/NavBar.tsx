import { createSignal, createEffect, Show, For, onCleanup } from "solid-js";
import { useStore } from "@nanostores/solid";
import { profileStore } from "../../stores/profile";
import { authStore } from "../../stores/auth";
import type { AuthStore } from '../../../types/urgeTypes';
import Logout from "../../components/auth/Logout";


const menuItems = [
    { title: "program", link: "/program", submenu: [] },
    { title: "network", link: "/network", submenu: [] },
    {
        title: "resources",
        link: "/resources",
        submenu: [
            { title: "templates", link: "/resources?type=templates" },
            { title: "blog", link: "/resources?type=blog" },
            { title: "guides", link: "/resources?type=guides" },
            { title: "stories", link: "/resources?type=guides" }
        ]
    },
    { title: "events", link: "/events", submenu: [] }
];

export default function Navbar() {
    const $auth = useStore(authStore);
    const $profile = useStore(profileStore);
    const [auth, setAuth] = createSignal<AuthStore | null>(null);
    const [isScrolled, setIsScrolled] = createSignal(false);

    createEffect(() => {
        if ($auth()) {
            setAuth($auth());
            console.log(auth());
        }
    });

    // Handle scroll event to change navbar style
    createEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);

        onCleanup(() => {
            window.removeEventListener("scroll", handleScroll);
        });
    });

    return (
        <div class="navbar bg-base-100 shadow-sm">
            <div class="flex-1">
                <a class="btn btn-ghost text-xl">daisyUI</a>
            </div>
            <div class="flex-none">
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                        <div class="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
                            <span class="badge badge-sm indicator-item">8</span>
                        </div>
                    </div>
                    <div
                        tabindex="0"
                        class="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
                        <div class="card-body">
                            <span class="text-lg font-bold">8 Items</span>
                            <span class="text-info">Subtotal: $999</span>
                            <div class="card-actions">
                                <button class="btn btn-primary btn-block">View cart</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                        <div class="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <ul
                        tabindex="0"
                        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <a class="justify-between">
                                Profile
                                <span class="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}