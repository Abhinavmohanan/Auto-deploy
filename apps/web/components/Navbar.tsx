import Link from "next/link"
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { Button } from "./ui/button";

export const Navbar = () => {

    async function onLogout() {
        await signOut();
        window.location.href = "/";
    }

    return (
        <nav className="flex flex-row justify-between">
            <div className="hidden p-7 font-medium  font-serif sm:flex flex-row items-center gap-5 text-sm lg:gap-6">
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
            </div>
            <div>
                <Button variant="link" className="hidden p-7 font-medium  font-serif sm:flex flex-row items-center gap-5 text-xl lg:gap-6" onClick={onLogout}>
                    <a className="p-7 font-medium font-serif text-sm lg:gap-6">Logout</a>
                </Button>
            </div>
        </nav>
    )
}
