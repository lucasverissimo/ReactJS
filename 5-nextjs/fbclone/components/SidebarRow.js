import Image from "next/image";

function SidebarRow({src, Icon, title}) {
    return (
        <div className="flex items-center space-x-2 hover:bg-gray-800 rounded-xl cursor-pointer p-2">
            {src && (
                <Image 
                    className="rounded-full"
                    src={src}
                    width={40}
                    height={40}
                    layout="fixed"
                />
            )}
            {Icon && (
                <Icon className="h-12 w-12 text-white p-1 rounded-full d-flex justify-center align-middle" />
            )}
            <p className="hidden sm:inline-flex font-medium text-white">{title}</p>
        </div>
    )
}

export default SidebarRow
