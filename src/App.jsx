import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { NonRegularTable } from './page/nonregulartable'
import axios from 'axios'
import React from 'react'
import TestInfoHolder from './components/testinfoholder'
import BaseProductSelector from './components/baseproductselector'

function App() {
  const [products, setProducts] = useState([])
  const [productsToBeUpdated, setProductsToBeUpdated] = useState([])
  const [loading, setLoading] = useState(false)
  const [sendingUpdate, setSendingUpdate] = useState(false)
  const [test, setTest] = useState(1)
  const [testType, setTestType] = useState('label')




  useEffect(() => {
    getProducts(test, testType)
  }, [test, testType])

  const updateProducts = useCallback(async () => {
    const products = productsToBeUpdated.map(product_object => {
      delete product_object.product.refs
      return product_object
  })

  const products_to_update = products.filter((product) => product.type === 'update').map((product) => {
    delete product.type
    return product.product
  })
  setSendingUpdate(true)
  const response = await axios.post('http://127.0.0.1:8000/api/product-testing/', {products: products_to_update, test: test, test_type: testType})
  console.log(response.status)
  setSendingUpdate(false)
  }, [productsToBeUpdated, test, testType])

  useEffect(() => {
    

  const updateCount = products.reduce((total, products_label_object) => {
      return total + products_label_object.products.length;
    }, 0);

      if (productsToBeUpdated.length > 9 || (updateCount == 0 && loading == false && productsToBeUpdated.length > 0)) {
        updateProducts()
        setProductsToBeUpdated([])
    }
  
  
}, [products, updateProducts, productsToBeUpdated, loading])


  const getProducts = async (test_number, testType) => {
    setLoading(true)
    const response = await axios.get(`http://127.0.0.1:8000/api/product-testing/?page=1&test_number=${test_number.toString()}&test_type=${testType}&page_size=25`)
    console.log(response.data)
    
    const productsWithRefs = response.data.results.map((products_label_object) => {
      if (testType === 'pricing') {
        const products = products_label_object.products.map((product) => {
          return {...product, refs: {name: React.createRef(), brand: React.createRef(), package_size: React.createRef(), base_product: React.createRef(), price: React.createRef(), sale_price: React.createRef(), price_per_pound: React.createRef(), deal_type: React.createRef()}}
        })
        return {...products_label_object, products: products}
      }else {
        const products = products_label_object.products.map((product) => {
          return {...product, refs: {name: React.createRef(), brand: React.createRef(), package_size: React.createRef(), base_product: React.createRef()}}
        })
        return {...products_label_object, products: products}
      }
  })
  setProducts(productsWithRefs)
  setLoading(false)
}

  const handleTestChange = (test_number, test_type) => {
    setTest(test_number)
    getProducts(test_number, test_type)
  }
  const handleTestTypeChange = (test_type, test_number) => {
    setTestType(test_type)
    getProducts(test_number, test_type)
  }

  return (
    <div className='w-full flex flex-row'>
      <div className='w-full'>
        <TestInfoHolder handleTestChange={handleTestChange} test={test} testType={testType} handleTestTypeChange={handleTestTypeChange}/>
        {sendingUpdate && <p>sending update...</p>}
          <NonRegularTable products={products} setProducts={setProducts} setProductsToBeUpdated={setProductsToBeUpdated} testType={testType}/>
      </div>
    </div>
  )
}

export default App
  