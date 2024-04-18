"use client"

export default function Button({onClickAction, text}) {
  return (
    <button
      onClick={onClickAction}
      className="transition ease-in-out hover:scale-110 duration-300 
            font-medium shadow-xl bg-purple-500 hover:bg-purple-700 
            text-white py-2 px-4 rounded-md focus:outline-none 
            focus:ring-2 focus:ring-purple-400"
    >
      {text}
    </button>
  );
}