import Image from "next/image";
import { BellIcon, ChatIcon, ChevronDownIcon, HomeIcon, UserGroupIcon, ViewGridIcon } from "@heroicons/react/solid";
import { FlagIcon, PlayIcon, SearchIcon, ShoppingCartIcon } from "@heroicons/react/outline";
import HeaderIcon from "./HeaderIcon";
import { signOut, useSession } from "next-auth/client";

export default function Header() {
    const [session] = useSession();
    return (
        <div className="bg-gray-800 sticky top-0 z-50 flex items-center p-2 lg:px-5 shadow-md">
            {/* Left */}
            <div className="flex items-center">
                <Image src="https://links.papareact.com/5me"  width={40} height={40} layout="fixed" />
                <div className="flex ml-2 items-center rounded-full bg-gray-100 p-2">
                    <SearchIcon className="h-6 text-gray-600" />
                    <input type="text" className="hidden md:inline-flex ml-2 items-center bg-transparent text-white outline-none placeholder-gray-400 flex-shrink" placeholder="What are you looking for?" />
                </div>
            </div>
            {/* center */}
            <div className="flex justify-center flex-grow">
                <div className="flex space-x-6 md:space-x-2">
                    <HeaderIcon Icon={HomeIcon} active={true} />
                    <HeaderIcon Icon={FlagIcon} />
                    <HeaderIcon Icon={PlayIcon} />
                    <HeaderIcon Icon={ShoppingCartIcon} />
                    <HeaderIcon Icon={UserGroupIcon} />
                </div>
            </div>
            
            {/* right */}
            <div className="flex items-center sm:space-x-2 justify-end">
                {/** profile pic <Image /> */}
                <Image 
                    onClick={()=>signOut()}
                    className="rounded-full cursor-pointer"
                    src={session.user.image}
                    width={40}
                    height={40}
                    layout="fixed"
                />
                <p className="whitespace-nowrap text-white font-semibold pr-3 hidden lg:inline-block">{session.user.name}</p>
                <ViewGridIcon className="icon" />
                <ChatIcon className="icon" />
                <BellIcon className="icon" />
                <ChevronDownIcon className="icon" />
            </div>

        </div>
    )
}
