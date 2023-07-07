import React from "react";

function Calculator({ name, initial, remaining, onCalculatorChange, onRemove }) {
    const profitLoss = remaining - initial;

    return (
        <div>
            <label>
                姓名:
                <input type="text" value={name} onChange={e => onCalculatorChange('name', e.target.value)} />
            </label>

            <label>
                初始金额:
                <input type="number" value={initial} onChange={e => onCalculatorChange('initial', e.target.value)} />
            </label>

            <label>
                剩余金额:
                <input type="number" value={remaining} onChange={e => onCalculatorChange('remaining', e.target.value)} />
            </label>

            <p>
                {name}的盈亏: {profitLoss}
            </p>

            <button onClick={onRemove}>删除此计算器</button>
        </div>
    );
}
export default Calculator;
