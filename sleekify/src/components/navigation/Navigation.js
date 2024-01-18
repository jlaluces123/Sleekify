const Navigation = () => {
    return (
        <div className='parent flex justify-between items-center w-full px-8 mt-8'>
            <div className='left'>
                <div className='logo'>
                    <h1 className='font-bold text-4xl'>Sleekify</h1>
                </div>
                <div className='sandwich'></div>
            </div>
            <div className='right flex flex-row'>
                <button className='cta-btn mr-4'>+ New Playlist</button>
                <div className='h-8 w-8 rounded-full bg-black'></div>
            </div>
        </div>
    );
};

export default Navigation;
