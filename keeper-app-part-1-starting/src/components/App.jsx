import React from "react";
import Heading from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import notes from "../note";



function App() {
    return (
        <div>
            <Heading />
            {notes.map(noteItem => (
                <Note
                    key={noteItem.key}
                    title={noteItem.title}
                    content={noteItem.content}
                />
            ))}
            <Footer />
        </div>
    );
}

export default App;


// function createNotes(noteItem) {
//     return (
//         <Note
//             key={noteItem.key}
//             title={noteItem.title}
//             content={noteItem.content}

//         />
//     );
// }