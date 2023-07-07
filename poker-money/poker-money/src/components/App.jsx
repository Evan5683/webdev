import React, { useState } from "react";
import Heading from "./Header";
import Footer from "./Footer";

import Calculator from "./Calculator";



function App() {
    const [calculators, setCalculators] = useState([{ name: "", initial: 0, remaining: 0 }]);
    function addCalculator(newCalculator) {
        setCalculators(prevCalculator => {
            return [...prevCalculator, newCalculator];
        });
    };

    function deleteCalculator(id) {
        setCalculators(prevCalculator => {
            return prevCalculator.filter((item, index) => {
                return index !== id;
            })
        })
    }

    function handleCalculatorChange(index, field, value) {
        const newCalculators = [...calculators];
        newCalculators[index][field] = value;
        setCalculators(newCalculators);
    }




    return (
        <div>
            <Heading />
            <h1>每个人的盈亏计算</h1>
            {calculators.map((calculators, index) => (
                <Calculator
                    key={index}
                    id={index}
                    name={calculators.name}
                    initial={calculators.initial}
                    remaining={calculators.remaining}
                    onCalculatorChange={(field, value) => handleCalculatorChange(index, field, value)}
                    onRemove={() => deleteCalculator(index)}
                />

            ))}
            <button onClick={addCalculator}>添加计算器</button>
            <Footer />
        </div>
    );
}
export default App;

