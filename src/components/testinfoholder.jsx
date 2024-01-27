


export default function TestInfoHolder({handleTestChange, test, testType, handleTestTypeChange}) {
    const test_types = ['label', 'base_product', 'pricing']
    console.log(testType)
    return (
        <div className="">

                <div className=' flex flex-row items-stretch p-6'>
                {test_types.map((i) => {
                    return (
                        <div key={i} className={`border-2  p-2 mx-2 w-full cursor-pointer ${i == testType ? 'border-red-500' : 'border-black'}`} onClick={() => handleTestTypeChange(i, test)}>
                            <p>{i}</p>
                        </div>
                    )
                })}
            </div>

            <div className=' flex flex-row items-stretch p-6'>
                {Array.from(Array(5).keys()).map((i) => {
                    return (
                        <div key={i+1} className={`border-2  p-2 mx-2 w-full cursor-pointer ${test == i+1 ? 'border-red-500' : 'border-black'}`} onClick={() => handleTestChange(i+1, testType)}>
                            <p>Test {i + 1}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )

}