import { NotesContext } from "../App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Sun, Moon } from "lucide-react";
import "../App.css";
import Error from "../assets/error.svg";
import { LocalTime } from "../helpers/localtime";
const Noteslist = () => {
  const {
    state: { savednotes, nosavednotes, searchtext, darkmode },
    dispatch,
  } = useContext(NotesContext);
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between items-center ">
        <h1 className="text-xl lg:text-2xl font-semibold">My Notes</h1>
        <div className="flex justify-center items-center  gap-4 lg:gap-12">
          <button
            onClick={() => {
              dispatch({ type: "change-theme" });
            }}
            className="transition-all appearance-none border-none outline-none"
          >
            {darkmode ? <Sun /> : <Moon />}
          </button>
          <button
            className="addnote-button"
            onClick={() =>
              document.startViewTransition(() => navigate("/note"))
            }
          >
            Add note
          </button>
        </div>
      </div>
      <input
        type="search"
        placeholder="search notes.."
        value={searchtext}
        className="search-input"
        onChange={(e) => {
          const { value } = e.target;
          dispatch({
            type: "search-notes",
            payload: value,
          });
        }}
      />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 my-2">
        {savednotes?.map((note) => {
          return (
            <div
              key={note.id}
              className="note-card"
              style={{ backgroundColor: note?.bgcolor }}
              onClick={() => {
                document.startViewTransition(() =>
                  navigate("/note", { state: note })
                );
              }}
            >
              <h2 className="text-lg lg:text-xl font-normal pb-2 truncate">
                {note.title}
              </h2>
              <h6 className="text-sm lg:text-base  font-normal line-clamp-3 text-stone-700">
                {note.description}
              </h6>
              <div className="flex justify-between items-center pt-5 pb-1">
                <h2 className="text-sm ">{LocalTime(note?.createdAt)}</h2>
                <button
                  className="px-1 py-1  rounded-full text-stone-700 hover:bg-gray-300 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.startViewTransition(() => {
                      dispatch({ type: "delete-notes", payload: note.id });
                    });
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {nosavednotes && (
        <div className="flex flex-col justify-center items-center">
          <img src={Error} alt="" className="size-72" />
          <h2 className="text-xl lg:text-2xl">No notes found</h2>
        </div>
      )}
    </>
  );
};

export default Noteslist;
