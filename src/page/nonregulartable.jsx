import EditableRow from "../components/rowedit"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
  } from "../components/table"
import { useState, useCallback } from "react"
import { useRef } from "react"
import { useEffect } from "react"
import BaseProductSelector from "../components/baseproductselector"

  
  export function NonRegularTable({ products, setProducts, setProductsToBeUpdated, testType }) {      
    const [tableEditQueue, setTableEditQueue] = useState([])
    const [focusedCell, setFocusedCell] = useState(null);
    const tableRef = useRef(null);



    


  const addActionToQueue = useCallback((...args) => {
      let old_product, new_product, type;
  
      // Assuming the last argument is always the type
      type = args[args.length - 1];
  
      if (type === 'update') {
          // For 'update', expect two products before the type
          [old_product, new_product] = args;
          const newAction = { type: 'update', new_product, old_product };
          setTableEditQueue(prevQueue => [...prevQueue, newAction]);
      }
      if (type === 'submit') {
          // For 'submit', expect one product before the type
          [new_product] = args;
          const newAction = { type: 'submit', new_product };
          setProductsToBeUpdated(prevProducts => [...prevProducts, {'type': 'update', 'product': new_product}])
          setTableEditQueue(prevQueue => [...prevQueue, newAction]);
      }
      if (type === 'delete') {
        // For 'delete', expect one product before the type
        
        [new_product] = args;
        new_product = {...new_product, 'deactivated': true}
        const newAction = { type: 'delete', new_product };
        setProductsToBeUpdated(prevProducts => [...prevProducts, {'type': 'update', 'product': new_product}])
        setTableEditQueue(prevQueue => [...prevQueue, newAction]);
        console.log(tableEditQueue)
      }
  }, [tableEditQueue, setTableEditQueue, setProductsToBeUpdated]);


    const handleCopy = useCallback((e) => {
      // Only copy if this cell is the focused cell

      if (focusedCell) {
        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', focusedCell.product[focusedCell.field]);
          e.preventDefault();
        }
      }
  }, [focusedCell]);

  const update_product = useCallback((new_product, upper_index = null) => {
    console.log(new_product)
    console.log(upper_index)
    setProducts(prevProducts => {
        const newProducts = [...prevProducts]
        let index;
        if (upper_index || upper_index === 0) {
          index = upper_index
        } else {
          index = newProducts.findIndex(p => p.label_text === new_product.label_text)
        }
        console.log(index)
        if (index !== -1) {
            // Check if the object exists before updating its property
            const products = newProducts[index].products
            const product_index = products.findIndex(p => p.id === new_product.id)
            if (product_index !== -1) {
                newProducts[index].products[product_index] = new_product
            } else {
                newProducts[index].products.push(new_product)
            }

        } else {
            console.log("Object not found")
        }
        return newProducts
    })
  }, [setProducts, ])

  const drop_product = useCallback((upper_index, id) => {
    setProducts(prevProducts => {
        const newProducts = [...prevProducts]
        console.log(newProducts[upper_index])
        if (upper_index !== -1) {

            const products = newProducts[upper_index].products
            const product_index = products.findIndex(p => p.id === id)
            if (product_index !== -1) {
                newProducts[upper_index].products.splice(product_index, 1)
            }

        } else {
            console.log("Object not found")
        }
        return newProducts
    })
  }, [setProducts])

  const getUpperIndex = useCallback((product_id) => {
    const upper_index = products.findIndex(p => p.products.map(p => p.id).includes(product_id))
    return upper_index
  }, [products])

  const update_cell = useCallback((new_product, field, value, upper_index) => {
    console.log(new_product)
    console.log(upper_index)
    const old_product = new_product
    new_product = {...new_product, [field]: value}
    addActionToQueue(old_product, new_product, 'update')
    if (upper_index) {
      update_product(new_product, upper_index)
      return
    }
    upper_index = getUpperIndex(new_product.id)
    update_product(new_product, upper_index)
    return
}, [update_product, addActionToQueue, getUpperIndex])

  const handleClearCell = useCallback(() => {
      if (focusedCell) {
        const product = {...focusedCell.product}
        const field = focusedCell.field
        update_cell(product, field, '')
      }
  }, [focusedCell, update_cell])

  const searchOriginalProductID = useCallback((upper_index, id) => {
    const newProducts = [...products]
    

    const found_product = newProducts[upper_index].products.find(product => product.id === id)
    
    return found_product
  

}, [products])

  const handleDelete = useCallback(() => {

      const product_id_cell = focusedCell.product.id
      const upper_index = getUpperIndex(product_id_cell)
      console.log(product_id_cell)
      const product_freshly_collected = searchOriginalProductID(upper_index, product_id_cell)
      addActionToQueue(product_freshly_collected, 'delete')
          //eventually be a pass off to a batch save function for product edits
      drop_product(upper_index, product_id_cell)
  }, [drop_product, focusedCell, addActionToQueue, searchOriginalProductID, getUpperIndex])


  
  const handleApprove = useCallback(() => {
      const product_id_cell = focusedCell.product.id
      const upper_index = getUpperIndex(product_id_cell)
      const product_freshly_collected = searchOriginalProductID(upper_index, product_id_cell)
      console.log(product_freshly_collected)
      addActionToQueue(product_freshly_collected, 'submit')
      //eventually be a pass off to a batch save function for product edits
      drop_product( upper_index, product_id_cell)

  }, [drop_product, focusedCell, addActionToQueue, searchOriginalProductID, getUpperIndex])
  // Paste handler

  const handlePaste = useCallback((e) => {
      if (focusedCell) {
        if (e.clipboardData) {

          const currentValue = focusedCell.product;
          const upper_index = getUpperIndex(currentValue.id)
          const pastedData = e.clipboardData.getData('text/plain');
          update_cell(currentValue, focusedCell.field, pastedData, upper_index) // Update the input value with the pasted data
          e.preventDefault();
        }
      }
  }, [focusedCell, update_cell, getUpperIndex]);










    const handleUndoAction = useCallback(() => {
      if (tableEditQueue.length === 0) {
          // No actions to undo
          return;
      }
      
      // Retrieve the last action
      const lastAction = tableEditQueue[tableEditQueue.length - 1];
      console.log(lastAction)
      if (lastAction.type === 'submit' || lastAction.type === 'delete') {
        console.log(lastAction.new_product)
          // If the last action was a submit,   add the product back to the table
          const product = lastAction.new_product;
          const upper_index = getUpperIndex(product.id)
          update_product(product, upper_index)
          setTableEditQueue(tableEditQueue.slice(0, -1));
      }
      if (lastAction.type === 'update') {
        const product = lastAction.new_product;
        const upper_index = getUpperIndex(product.id)
      update_product(lastAction.old_product, upper_index)
      // Create a new array without the last action and update the state
      setTableEditQueue(tableEditQueue.slice(0, -1));
      
      // Optionally, return or do something with lastAction
      return lastAction;
      }
  }, [tableEditQueue, update_product, getUpperIndex]);


    const handleFocus = (product, field, index, has_multiple) => {
        setFocusedCell({product, field, index, has_multiple})
  };

  const handleKeyDownArrow = useCallback((e, currentRow, currentColumn, rows, columns) => {
    let newRow = currentRow;
    let newColumn = currentColumn;
    const isFirstRowOfRowSpan = focusedCell.index == 0;
    const has_multiple = focusedCell.has_multiple;
    // Adjust the column index for rows affected by the rowSpan

      // Adjust the column index for rows affected by the rowSpan
      if (isFirstRowOfRowSpan && has_multiple && newColumn >= 0) {
        newColumn -= 1; // Adjust column index if it's after the rowSpanned cell
      }
    
      switch (e.key) {
        case 'ArrowRight': {
          newColumn = (newColumn + 1) % columns;
          if (newColumn === 0) newRow = (newRow + 1) % rows;
          break;
        }
        case 'ArrowLeft': {
          newColumn = (newColumn - 1 + columns) % columns;
          if (newColumn === columns - 1 && newRow > 0) newRow -= 1;
          break;
        }
        case 'ArrowDown': {
          newRow = (newRow + 1) % rows;
          break;
        }
        case 'ArrowUp':{
          newRow = (newRow - 1 + rows) % rows;
          const column_length = tableRef.current.rows[currentRow].cells.length;
          const new_column_length = tableRef.current.rows[newRow].cells.length;
          if (isFirstRowOfRowSpan && !has_multiple && new_column_length !== column_length) {
            newColumn -= 1;
          }
          if (isFirstRowOfRowSpan && has_multiple) {
            newColumn += 1;
          }
          break;
        }
        default:
          return {}; // Return empty object for other keys
      }
    

      if (newRow !== currentRow && has_multiple) {

        // If the row has changed, check if the new row has a rowSpan
        const num_of_cols_in_old_row = tableRef.current.rows[currentRow].cells.length
        const num_of_cols_in_new_row = tableRef.current.rows[newRow].cells.length
        if (num_of_cols_in_old_row < num_of_cols_in_new_row) {
          // If the new row has a rowSpan, adjust the column index
          newColumn += 1;
        }
      

      }
      if (newRow === currentRow && isFirstRowOfRowSpan && has_multiple) {
        newColumn += 1;
      }
      // Readjust the column index for the new position if needed


      return { newRow, newColumn };
    }, [focusedCell]);

  const setIsEditing = useCallback((currentElement) => {
        const cellRef = focusedCell.product.refs[focusedCell.field].current
        const boolean = cellRef.toggleEdit()
        if (!boolean) {
          var element = currentElement;
          while (element && element.nodeName !== 'TD') {
              element = element.parentNode;
          }

          if (element) {
              element.focus();
          }

      }

    }, [focusedCell]);

    const toggleEditState = useCallback((index) => {
      const focused_element =  tableRef.activeElement;

  }, [tableRef]);

  useEffect(() => {
      if (tableRef.current) {
          const table = tableRef.current;
          const rows = table.rows.length;
          const columns = table.rows[0]?.cells.length || 0;

          let lastExecutionTime = 0;


 // Assuming each row has the same number of cells

        const keyDownHandler = (e) => {

            const now = Date.now();

            // Check if the handler was executed in the last 50ms
            if (now - lastExecutionTime < 50) {
                return;
            }
            if(e.key.includes('Arrow')) {
            lastExecutionTime = now;
            let currentCell = document.activeElement;
            let currentRow = currentCell.parentElement.rowIndex;
            let currentColumn = currentCell.cellIndex;

            const { newRow, newColumn } = handleKeyDownArrow(e, currentRow, currentColumn, rows, columns);

            if (newRow !== undefined && newColumn !== undefined) {
              let newCell = tableRef.current.rows[newRow].cells[newColumn];
              newCell.focus();
            }
          }
          if (e.key === 'z' && e.ctrlKey) {
            handleUndoAction()
          }
          if (e.key === 'Backspace' && e.ctrlKey) {
           
            let currentCell = document.activeElement;
            let currentRowIndex = currentCell.parentElement.rowIndex;
            let currentRow = tableRef.current.rows[currentRowIndex];
            let currentColumnIndex = currentCell.cellIndex;
            let newCell;
            // Ensure the next row exists
            if (currentRowIndex + 1 < tableRef.current.rows.length) {
                let rowBelow = tableRef.current.rows[currentRowIndex + 1];

            
                // Compare the cell lengths and adjust the column index if necessary
                if (rowBelow.cells.length < currentRow.cells.length) {
                    newCell = rowBelow.cells[currentColumnIndex - 1 >= 0 ? currentColumnIndex - 1 : 0];
                } else if (rowBelow.cells.length > currentRow.cells.length) {
                    newCell = rowBelow.cells[currentColumnIndex + 1 < rowBelow.cells.length ? currentColumnIndex + 1 : rowBelow.cells.length - 1];
                } else {
                    newCell = rowBelow.cells[currentColumnIndex];
                }
            
                // Set focus to the new cell if it exists
                if (newCell) {
                    newCell.focus();
                }
            }
            handleDelete()
            newCell.focus();
            e.preventDefault();
          }
          if (e.key === 'Enter' && e.target.tagName.toLowerCase() === 'input') {
            let currentCell = document.activeElement;
            setIsEditing(currentCell)
          }

          if (e.target.tagName.toLowerCase() !== 'input') {
            if (e.key === ' ') {

              let currentCell = document.activeElement;
              let currentRowIndex = currentCell.parentElement.rowIndex;
              let currentRow = tableRef.current.rows[currentRowIndex];
              let currentColumnIndex = currentCell.cellIndex;
              let newCell;
              // Ensure the next row exists
              if (currentRowIndex + 1 < tableRef.current.rows.length) {
                  let rowBelow = tableRef.current.rows[currentRowIndex + 1];
              
                  // Compare the cell lengths and adjust the column index if necessary
                  if (rowBelow.cells.length < currentRow.cells.length) {
                      newCell = rowBelow.cells[currentColumnIndex - 1 >= 0 ? currentColumnIndex - 1 : 0];
                  } else if (rowBelow.cells.length > currentRow.cells.length) {
                      newCell = rowBelow.cells[currentColumnIndex + 1 < rowBelow.cells.length ? currentColumnIndex + 1 : rowBelow.cells.length - 1];
                  } else {
                      newCell = rowBelow.cells[currentColumnIndex];
                  }
              
                  // Set focus to the new cell if it exists
                  if (newCell) {
                      newCell.focus();
                  }
              }
              handleApprove()
              newCell.focus();
              e.preventDefault();
            }

            if (e.key === 'd') {
              handleClearCell()
              e.preventDefault();
            }
            if (e.key === 'e') {
              console.log('e pressed')
              console.log(document.activeElement)
              let currentCell = document.activeElement;
              setIsEditing(currentCell)
              e.preventDefault();
            }
          }

        };
        
      



        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);
        table.addEventListener('keydown', keyDownHandler);

        // Cleanup function
        return () => {
            table.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
        };
        
    }}, [handleCopy, handlePaste, handleKeyDownArrow, handleUndoAction, handleApprove, handleDelete, handleClearCell, setIsEditing]); 

    if (!products || products.length === 0) {
      return <div>Loading...</div>; // or any other placeholder
  }

    return (

      <div className="flex flex-row">
          <Table className='' id='data-table' ref={tableRef}>
            <TableHeader className=''>
              <TableRow className=''>
                <TableHead className="w-[300px] text-left p-4 capitalize">{testType}</TableHead>
                {testType === 'base_product' && (<TableHead className='text-left p-4'>Original Label</TableHead>)}
                <TableHead className="w-[150px] text-left p-4 capitalize">Brand</TableHead>
                <TableHead className='text-left p-4'>Name</TableHead>
                <TableHead className='text-left p-4'>Base Product</TableHead>
                <TableHead className='whitespace-nowrap text-left p-4'>Package Size</TableHead>
                {
                  testType === 'pricing' && (
                    <>
                    <TableHead className='text-left p-4'>price</TableHead>
                    <TableHead className='text-left p-4'>sale price</TableHead>
                    <TableHead className='text-left p-4'>price per pound</TableHead>
                    <TableHead className='text-left p-4'>deal type</TableHead>
                    </>
                  )
                }
              </TableRow>
            </TableHeader>
            <TableBody className=''>

              {products.map((product, index) => {

              return  <EditableRow key={index} upper_index={index} update_cell={update_cell} label_product_object={product} setProducts={setProducts} handleFocus={handleFocus} tableRef={tableRef} toggleEditState={tableRef.toggleEditState} testType={testType}/>
              })}
            </TableBody>
        </Table>
        {(focusedCell && testType === 'base_product')  && (
        <div className='w-2/12'>
                <BaseProductSelector product={focusedCell.product} field={focusedCell.field} update_cell={update_cell}/>
        </div>
        )}
      </div>
      
    )
  }
  

