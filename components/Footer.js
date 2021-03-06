const Footer = () => {
    const thisYear = new Date().getFullYear();
    return (
        <footer className="bg-slate-700 z-50 text-yellow-600 py-3 text-center items-center w-full mt-52 opacity-80">
            <h1 className="text-sm">
                <span className="font-bold">TodoList</span>
                <span className="font-bold">
                    &copy;
                    {thisYear}
                </span>
                <span className="font-mono">By Mohammed-EL-Khamlichi</span>
            </h1>
        </footer>
    );
};

export default Footer;
