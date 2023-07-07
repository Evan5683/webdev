import React, { useState } from "react";
import Heading from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import Calculator from "./Calculator";



function App() {
    return (
        <div className="App">
            <h1>每个人的盈亏计算</h1>
            <Calculator />
        </div>
    );
}

export default App;

