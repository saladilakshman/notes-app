import { NotesContext } from "../App";
import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, SquareArrowOutUpRight } from "lucide-react";
import { lightColors } from "../data";
import { LocalTime } from "../helpers/localtime";
import html2canvas from "html2canvas";
import "../App.css";
const Notesedit = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    state: { savednotes },
    dispatch,
  } = useContext(NotesContext);
  const [notesdetails, setNotesdetails] = useState(
    () =>
      state ?? {
        id: "",
        title: "",
        description: "",
        createdAt: "",
        bgcolor: "",
      }
  );
  const Inputchange = (event) => {
    const { name, value } = event.target;
    setNotesdetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const sharenote = async (txt) => {
    const textArea = document.getElementById("text-area");
    if (txt.includes("picture")) {
      await html2canvas(textArea)
        .then((canvas) => {
          canvas.toBlob((blob) => {
            const file = new File([blob], "screenshot.png", {
              type: "image/png",
            });
            navigator
              .share({
                files: [file],
                title: "Shared Image",
              })
              .catch((err) => console.log(err.message));
          });
        })
        .catch((err) => console.log(err.message));
    } else {
      await navigator
        .share({ text: notesdetails?.description })
        .catch((err) => console.log(err.message));
    }
    setShowMenu(false);
  };
  const [showmenu, setShowMenu] = useState(false);
  useEffect(() => {
    document.body.addEventListener("click", () => {
      setShowMenu(false);
    });
  }, []);
  return (
    <>
      <div className="flex justify-between">
        <div className="flex-1">
          <button className="back-to-home" onClick={() => navigate("/")}>
            <ChevronLeft size={15} />
            <span className="hidden md:block">Back</span>
          </button>
        </div>
        <div className="relative group">
          <button
            className="share-button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            disabled={notesdetails?.description.length === 0 ? true : false}
          >
            <SquareArrowOutUpRight size={15} />
            <span className="hidden md:block">share note</span>
          </button>
          <div
            className={`share-buttons ${
              showmenu ? "opacity-100" : "opacity-0"
            }`}
          >
            {["share as text", "share as picture"].map((txt, index) => {
              return (
                <button
                  key={index}
                  className="hover:bg-stone-300 w-full px-2"
                  onClick={() => sharenote(txt)}
                >
                  {txt}
                </button>
              );
            })}
          </div>
        </div>
        <button
          className="save-button "
          disabled={notesdetails.description.length > 0 ? false : true}
          onClick={() => {
            const details = {
              ...notesdetails,
              id: savednotes.find((q) => q.id === notesdetails.id)
                ? notesdetails.id
                : Date.now(),
              createdAt: new Date().toString(),
              bgcolor:
                lightColors[Math.floor(Math.random() * lightColors.length)],
            };
            setNotesdetails(details);
            dispatch({ type: "edit-notes", payload: { ...details } });
          }}
        >
          save
        </button>
      </div>
      {notesdetails.createdAt && (
        <h3 className="text-base  text-gray-600 pt-8 dark:text-zinc-200">
          {LocalTime(notesdetails?.createdAt)},
          <span className="text-sm text-gray-500 lg:pl-3 pl-2 dark:text-zinc-200">
            {notesdetails.description.replace(/[\s,.]/g, "").length} Characters
          </span>
        </h3>
      )}
      <div className=" py-12 md:py-14">
        <input
          type="text"
          name="title"
          spellCheck={true}
          value={notesdetails?.title}
          onChange={(e) => Inputchange(e)}
          className="title-input"
          placeholder="Title"
        />
        <textarea
          placeholder="Description"
          name="description"
          id="text-area"
          value={notesdetails?.description}
          spellCheck={true}
          className="description-input texter"
          onChange={(e) => {
            const inputElement = document.querySelector(".texter");
            if (inputElement.scrollHeight > inputElement.clientHeight) {
              inputElement.style.height = `${inputElement.scrollHeight}px`;
            }
            Inputchange(e);
          }}
        />
      </div>
    </>
  );
};

export default Notesedit;
