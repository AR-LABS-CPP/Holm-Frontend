export default function HistoryBox({ text }) {
    return (
        <div className="mt-5 w-full h-12 rounded-full border-[1px] border-gray-300 shadow-lg flex items-center justify-center italic hover:bg-gray-100 hover:cursor-pointer">
            <p className="text-gray-600 px-5 truncate">{text}</p>
        </div>
    );
}