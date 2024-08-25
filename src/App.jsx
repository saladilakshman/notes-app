import { useReducer, createContext, useEffect } from "react";
import "./App.css";
import Notesedit from "./components/notesedit";
import Noteslist from "./components/noteslist";
import { HashRouter, Routes, Route } from "react-router-dom";
import { notes } from "./data";
import { lightColors } from "./data";
export const NotesContext = createContext();
function App() {
  const noteswithColors = notes.map((nt) => ({
    ...nt,
    bgcolor: lightColors[Math.floor(Math.random() * lightColors.length)],
  }));
  const initialstate = {
    staticdata: noteswithColors,
    savednotes: noteswithColors,
    notesdetails: {
      title: "",
      description: "",
    },
    nosavednotes: false,
    searchtext: "",
    darkmode: false,
  };
  const notesreducer = (state, action) => {
    switch (action.type) {
      case "change-theme":
        return {
          ...state,
          darkmode: !state.darkmode,
        };
      case "notes-details-insertion":
        return {
          ...state,
          notesdetails: {
            ...state.notesdetails,
            [action.payload.name]: action.payload.value,
          },
        };
      case "save-notes":
        return {
          ...state,
          savednotes: [...state.savednotes, action.payload],
        };
      case "delete-notes": {
        const updatednotes = state.savednotes.filter(
          (note) => note.id !== action.payload
        );
        return {
          ...state,
          savednotes: updatednotes,
          staticdata: updatednotes,
        };
      }
      case "edit-notes": {
        const isnotesalreadysaved = state.savednotes.findIndex(
          (item) => item.id === action.payload.id
        );
        if (isnotesalreadysaved > -1) {
          const updatedNotes = [...state.savednotes];
          updatedNotes[isnotesalreadysaved] = action.payload;
          return {
            ...state,
            savednotes: updatedNotes,
            staticdata: updatedNotes,
          };
        }
        return {
          ...state,
          savednotes: [...state.savednotes, action.payload],
          staticdata: [...state.staticdata, action.payload],
        };
      }
      case "search-notes": {
        const isnoteavailable = state?.savednotes.filter((el) =>
          el.title.toLowerCase().includes(action.payload.trim().toLowerCase())
        );
        if (isnoteavailable.length === 0 && action.payload.length > 0) {
          return {
            ...state,
            savednotes: [],
            nosavednotes: true,
            searchtext: action.payload,
          };
        } else if (!action.payload) {
          return {
            ...state,
            savednotes: state?.staticdata,
            nosavednotes: false,
            searchtext: action.payload,
          };
        } else {
          return {
            ...state,
            savednotes: isnoteavailable,
            nosavednotes: false,
            searchtext: action.payload,
          };
        }
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(notesreducer, initialstate, (args) => {
    const islocaldata = window.localStorage.getItem("notes");
    return JSON.parse(islocaldata) ?? args;
  });
  useEffect(() => {
    if (state.darkmode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [state.darkmode]);

  useEffect(() => {
    window.localStorage.setItem("notes", JSON.stringify(state));
  }, [state]);
  return (
    <NotesContext.Provider value={{ state, dispatch }}>
      <HashRouter>
        <div className="container mx-auto px-4 lg:px-60 py-4 transition-color">
          <Routes>
            <Route path="/" element={<Noteslist />} />
            <Route path="/note" element={<Notesedit />} />
          </Routes>
        </div>
      </HashRouter>
    </NotesContext.Provider>
  );
}

export default App;
