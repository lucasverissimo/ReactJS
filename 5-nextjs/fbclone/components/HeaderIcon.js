function HeaderIcon({ Icon, active }) {
    return (
        <div className="cursor-pointer flex items-center rounded-xl md:px-10 sm:h-14 md:hover:bg-gray-600 active:border-b-2 active:border-white group">
            <Icon className={`h-5 text-center sm:h-7 mx-auto text-white group-hover:text-blue-400 ${active && 'text-blue-400'}`} />
        </div>
    )
}

export default HeaderIcon;
