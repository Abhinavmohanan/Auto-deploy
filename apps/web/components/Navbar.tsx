import Link from "next/link"

export const Navbar = () => {
    return (
        <nav className="hidden p-7 font-medium sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
            <Link className="font-bold" href="#">
                Deploy
            </Link>
            <Link className="text-gray-500 dark:text-gray-400" href="#">
                Settings
            </Link>
            <Link className="text-gray-500 dark:text-gray-400" href="#">
                Logs
            </Link>
            <Link className="text-gray-500 dark:text-gray-400" href="#">
                History
            </Link>
        </nav>
    )
}
