import React from "react"

import { useState } from "react"
import { CopyPlus } from "lucide-react";
import { useEffect } from "react";
import { useImperativeHandle } from "react";

const EditableDataCell = React.forwardRef(({product, upper_index, editable, text, field, update_cell }, ref) => {
    const [inputValue, setInputValue] = useState(text);
    const [singleCellIsEditable, setSingleCellIsEditable] = useState(false);
    const inputRef = React.useRef(null);
    const divRef = React.useRef(null);

    

    // Function to handle the input change
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };
    
    useEffect(() => {
        if (singleCellIsEditable) {
            inputRef.current.focus();
        }
        }, [singleCellIsEditable]);
    // update input to current ref value chagne through copy paste, etc.
    const submitChanges = () => {
        setSingleCellIsEditable(false);
        console.log(upper_index)
        update_cell(product, field, inputValue, upper_index)
    }

    useImperativeHandle(ref, () => ({
        toggleEdit: () => {
            const newState = !singleCellIsEditable;
            setSingleCellIsEditable(newState);
            if (newState) {
                // Focus the input when entering edit mode
                setTimeout(() => inputRef.current?.focus(), 0);
            }
            return newState; // Return the new editing state
        },
        getValue: () => ({ inputValue, field }),
        focus: () => {
            let element = divRef.current;
            // Traverse up the DOM tree to find the first parent TD element

            while (element && element.nodeName !== 'TD') {
                element = element.parentElement;
            }
            if (element) {
                element.focus(); // Focus the TD element
            }
        },
    }));


    return (
        <div className="w-full" ref={divRef}>
            {editable || singleCellIsEditable ? (
                <input
                    ref = {inputRef}
                    className="editable-cell w-full h-full p-2 m-0  rounded-md"
                    type="text"
                    placeholder={inputValue}
                    value={inputValue} // Make sure to set the input's value to inputValue
                    onChange={e => handleInputChange(e)}
                    onBlur={() => {
                        submitChanges();
                      }}
                />
            ) : (
                <div className="flex flex-row justify-between h-full w-full">
                    <p onClick={() => setSingleCellIsEditable(true)} className={field === 'brand' ? 'capitalize w-full  text-left': 'w-full text-left'}>{text}</p>
                </div>
            )}
        </div>
    )
}
);
EditableDataCell.displayName = "EditableDataCell"

export default EditableDataCell;