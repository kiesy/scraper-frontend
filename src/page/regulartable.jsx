import React, { useState, useEffect, useRef } from 'react';
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead } from '../components/table';


export default function RegularTable({ tableRef, products, setProducts, testType, update_cell, handleFocus, focusedCell }) {
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
      
                    </TableRow>
                  </TableHeader>
                  <TableBody className=''>
      
                    {products.map((product, index) => {
      
                    return  <EditableRow key={index} upper_index={index} update_cell={update_cell} label_product_object={product} setProducts={setProducts} handleFocus={handleFocus} tableRef={tableRef} toggleEditState={tableRef.toggleEditState} testType={testType}/>
                    })}
                  </TableBody>
              </Table>
              {focusedCell  && (
              <div className='w-2/12'>
                      <BaseProductSelector product={focusedCell.product} field={focusedCell.field} update_cell={update_cell}/>
              </div>
              )}
            </div>
            

    )
}