import React from 'react';
import { TableRow, TableCell } from './table';

import EditableDataCell from './editabledatacell';



export default function EditableRow({ upper_index, update_cell, label_product_object, setProducts, handleFocus, toggleEditState, testType }) {

    const [isEditing, setIsEditing] = React.useState(false)
    const [labelOriginal, setLabelOriginal] = React.useState(false)


      const handleFocusAugmented = (product, field, index) => {

        let has_multiple = false

        if (label_product_object.products.length > 1) {
          has_multiple = true
        }
        handleFocus(product, field, index, has_multiple)
      }

      const pricingEditableCells = (product, index) => {
        return (
          <>
            <TableCell className=' px-4 h-16 w-[200px]' tabIndex={0} onFocus={() => handleFocusAugmented(product, 'price', index)} >
                <EditableDataCell  product={product} upper_index={upper_index} update_cell={update_cell} text={product.price} setProducts={setProducts} field='price' toggleEditState={toggleEditState} editable={isEditing} ref={el => product.refs['price'].current = el}/>
            </TableCell>
            <TableCell className=' px-4 h-16 w-[200px]' tabIndex={0} onFocus={() => handleFocusAugmented(product, 'sale_price', index)} >
                <EditableDataCell  product={product} upper_index={upper_index} update_cell={update_cell} text={product.sale_price} setProducts={setProducts} field='sale_price' toggleEditState={toggleEditState} editable={isEditing} ref={el => product.refs['sale_price'].current = el}/>
            </TableCell>
            <TableCell className=' px-4 h-16 w-[200px]' tabIndex={0} onFocus={() => handleFocusAugmented(product, 'price_per_pound', index)} >
                <EditableDataCell  product={product} upper_index={upper_index} update_cell={update_cell} text={product.price_per_pound} setProducts={setProducts} field='price_per_pound' toggleEditState={toggleEditState} editable={isEditing} ref={el => product.refs['price_per_pound'].current = el}/>
            </TableCell>
            <TableCell className=' px-4 h-16 w-[200px]' tabIndex={0} onFocus={() => handleFocusAugmented(product, 'deal_type', index)} >
                <EditableDataCell  product={product} upper_index={upper_index} update_cell={update_cell} text={product.deal_type} setProducts={setProducts} field='deal_type' toggleEditState={toggleEditState} editable={isEditing} ref={el => product.refs['deal_type'].current = el}/>
            </TableCell>
          </>
        )
      }


    return (
      <>

        {label_product_object.products.map((product, index) => (
              <TableRow 
              className={`justify-center py-4 ${(label_product_object.products.length == 1 || index == label_product_object.products.length -1) ? 'border-b-4 border-gray-300' : 'border-b-2 border-gray-200'}`} 
              key={product.id}
              >
                {testType != 'base_product' ? (
                index === 0 && (
                    <TableCell className='w-[400px] text-left pr-4' rowSpan={label_product_object.products.length} onMouseEnter={() => setLabelOriginal(true)} onMouseLeave={() => setLabelOriginal(false)}>

                        <p>
                        {!labelOriginal ? label_product_object.label_text : product.original_label_text}
                        </p>

                    </TableCell>
                )
                ) : 
                  index === 0 && (
                    <TableCell className='w-[200px] text-left pr-4' rowSpan={label_product_object.products.length} >

                        <p>
                        {label_product_object.base_product}
                        </p>

                    </TableCell>
                  )
                }
                {
                  testType === 'base_product' && (
                    <TableCell className=' px-4 h-16 w-[500px] text-left' >
                      {product.original_label_text}
                    </TableCell>
                  )
                }
                
                <TableCell className="font-medium px-4 h-16 w-[200px]" tabIndex={0} onFocus={() => handleFocusAugmented(product, 'brand', index)} >
                    <EditableDataCell product={product} upper_index={upper_index}  update_cell={update_cell} text={product.brand} setProducts={setProducts}  field='brand' toggleEditState={toggleEditState} editable={isEditing} ref={el => product.refs['brand'].current = el}/>
                    </TableCell>
                <TableCell className=' px-4 h-16 w-[500px]' tabIndex={0} onFocus={() => handleFocusAugmented(product, 'name', index)} >
                    <EditableDataCell product={product} upper_index={upper_index}  update_cell={update_cell} text={product.name} setProducts={setProducts}  field='name' toggleEditState={toggleEditState} editable={isEditing} ref={el => product.refs['name'].current = el}/>
                </TableCell>

                <TableCell className=' px-4 h-16 w-[200px]' tabIndex={0} onFocus={() => handleFocusAugmented(product, 'base_product', index)} >
                    <EditableDataCell  product={product} upper_index={upper_index}  update_cell={update_cell} text={product.base_product} setProducts={setProducts} field='base_product' toggleEditState={toggleEditState} editable={isEditing} ref={el => product.refs['base_product'].current = el}/>
                </TableCell>
                <TableCell className=' px-4 h-16 w-[200px]' tabIndex={0} onFocus={() => handleFocusAugmented(product, 'package_size', index)} >
                    <EditableDataCell  product={product} upper_index={upper_index} update_cell={update_cell} text={product.package_size} setProducts={setProducts} field='package_size' toggleEditState={toggleEditState} editable={isEditing} ref={el => product.refs['package_size'].current = el}/>
                </TableCell>
                {
                  testType === 'pricing' && (
                    pricingEditableCells(product, index)
                  )
                  
                  
                }                

           
      </TableRow>
    ))}
    </>
    )
}

