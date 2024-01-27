import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'


export default function BaseProductSelector({product, field, update_cell }) {

    const [dbMatch, setDbMatch] = useState(null)
    const [dbMatchLoading, setDbMatchLoading] = useState(false)
    const [siblings, setSiblings] = useState(null)
    const [siblingsLoading, setSiblingsLoading] = useState(false)
    const [parent, setParent] = useState(null)
    const [parentLoading, setParentLoading] = useState(false)


    const getBaseProductSelection = async (searchTerm) => {
        setDbMatchLoading(true)
        setSiblingsLoading(true)
        setParentLoading(true)
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/product-testing/get_base_product/?base_product=${searchTerm}`);
            console.log(response.data)
            if (response.status == 200) {
            setSiblings(response.data[0][1]);  // Set siblings after the data is fetched
            setParent(response.data[0][0]);
            setDbMatch(response.data[0][3]);
            } else {
                setSiblings(null);
                setParent(null);
                setDbMatch(null);
            }
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setDbMatchLoading(false);
            setSiblingsLoading(false);  // Set loading to false after the data is fetched
            setParentLoading(false);
        }
    }

    useEffect(() => {

        if (field == 'base_product' && product) {
        getBaseProductSelection(product.base_product)
        }
    
    }, [product, field])

    const updateBaseProductFromClick = (value) => { // Start from the ref's current element
        const element = product.refs.base_product.current;

        if (element && typeof element.focus === 'function') {
            element.focus(); // This should now focus the input field
        }

    
    
        const product_obj = product;
        update_cell(product_obj, 'base_product', value);
    };

    const renderSiblings = () => {
        if (siblings) {
            if (typeof siblings[0] === 'string') {
            return siblings.map((product, index) => {
                return <p key={index} onClick={() => updateBaseProductFromClick(product)}>{product}</p>
            })
        } else {
            return Object.keys(siblings).map((product, index) => {
                return <p key={index} onClick={() => updateBaseProductFromClick(product.base_product)}>{product.base_product}</p>
            })
        }
        } else if (siblingsLoading) {
            return <p>Loading</p>
        }
        else {
            return <p>Unable to find siblings</p>
        }
    }

    const renderDbMatchItems = () => {
        if (!dbMatchLoading && dbMatch) {
            console.log(dbMatch)
        if (typeof dbMatch === 'string') {
                return <p onClick={() => updateBaseProductFromClick(dbMatch)}>{dbMatch}</p>
            } else if (typeof dbMatch[0] === 'string'){
            return dbMatch.map((product, index) => {
                return <p key={index} onClick={() => updateBaseProductFromClick(product)}>{product}</p>
            })
        } else if (typeof dbMatch === 'object'){
            return Object.keys(dbMatch).map((product, index) => {
                return <p key={index} onClick={() => updateBaseProductFromClick(product)}>{product}</p>
            })
        } else {
            return <p>unable to place dbMatches check formatting</p>
        }
    } else if (dbMatchLoading) {
        return <p>Loading</p>
    } else {
        return <p>Unable to find dbMatch</p>
    }

}

    return (
        <div className='w-[250px]'>
            <div className='flex flex-col w-full h-full border-2 border-gray-300 p-4 space-y-8'> 
                <div>
                    <p className='underline'>Active Base Product</p>
                    {(product && typeof dbMatch === 'string') && <p className={`${product.base_product == dbMatch ? ``: `text-red-600`}`}>{product.base_product}</p>}
                </div>
                <div>
                    <p className='underline'>Parent Base Product</p>
                    {!parentLoading && <p onClick={() => updateBaseProductFromClick(parent)}>{parent}</p>}
                </div>
                <div>
                <p className='underline'>Suggested Base Product</p>
                {!dbMatchLoading &&
                renderDbMatchItems()
                }
                
                </div>
                <div>
                    <p className='underline'>Siblings</p>
                    {!siblingsLoading && renderSiblings()}
                </div>
            </div>
        </div>
    )
}