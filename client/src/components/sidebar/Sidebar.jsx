import Conversations from './Conversations'
import SearchInput from './SearchInput'

const Sidebar = () => {
    return (
        <div className='border-r border-slate-500 p-4 py-4 flex flex-col'>
            {/* Typing Animation Only */}
            <div className="flex justify-center mb-4">
                <h1 className="text-2xl font-bold typing-container">
                    <span className="typing-text"></span><span className="cursor">|</span>
                </h1>
            </div>

            <SearchInput />
            <div className="divider px-3"></div>
            <Conversations />
        </div>
    )
}

export default Sidebar
