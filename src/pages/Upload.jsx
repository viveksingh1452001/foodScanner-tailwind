import React, { useState,useCallback, useEffect } from 'react'
import getCroppedImg from '../components/Cropped';
import Quagga from 'quagga'
import Cropper from 'react-easy-crop'

const Upload = () => {
    const [barcode, setBarcode] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    // const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    // const [loading, setLoading] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);

    // 1-------------------------->
    const onSelectFile = (event) => {
        if (event.target.files && event.target.files.length > 0) {
          const reader = new FileReader();
          reader.onload = () => {
            setImageSrc(reader.result);
          };
          reader.readAsDataURL(event.target.files[0]);
        }
      };

      //2-------------------------------->
      const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
      }, []);

      //3--------------------------------->
      const showCroppedImage = useCallback(async () => {
        try {
          const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
          console.log("Cropped image:", croppedImage);
          setCroppedImage(croppedImage);
          decodeBarcode(croppedImage);
        } catch (e) {
          console.error(e);
        }
      }, [imageSrc, croppedAreaPixels]);

      //4-------------------------------------->
      const decodeBarcode = (src) => {
        Quagga.decodeSingle(
          {
            decoder: {
              readers: ["ean_reader", "code_128_reader"], // List of active readers
            },
            locate: true, // try to locate the barcode in the image
            src: src,
          },
          function (result) {
            console.log(result);
            if (result && result.codeResult) {
              console.log("result", result.codeResult.code);
              setBarcode(result.codeResult.code);
              // onBarcodeScan(result.codeResult.code); // Callback to parent component
            } else {
              console.log("not detected");
              setBarcode("Not detected");
              //onBarcodeScan("Not detected"); // Callback to parent component
            }
          }
        );
      };


      // 5------------------------------>
      useEffect(() => {
        const fetchData = async () => {
          try {
            
            setData(null);
            if (!barcode) return; // Return if scannedBarcode is null or undefined
            // setLoading(true);
            const response = await fetch(
              `https://world.openfoodfacts.org/api/v3/product/${barcode}.json`
            );
    
            if (!response.ok) {
              throw new Error("Product not found/ code not scanned");
            }
    
            const jsonData = await response.json();
            
            console.log("API Response:", jsonData);
            setData(jsonData);
            // setError(null);
            // setLoading(false);
          } catch (error) {
            // setError(error.message);
            // setLoading(false);
            console.log(error)
          }
        };
    
        fetchData();
      }, [barcode]);


    return (
        <div className=" relative  mx-auto lg:top-28  max-w-7xl  px-6 py-32  lg:px-8 lg:py-8 rounded-t-md bg-amber-400">

            {/* input */}
            <div className='w-full min-h-full  lg:flex justify-center '>
                <div className="flex items-center justify-center w-80">
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50   hover:bg-gray-100   "
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                                className="w-8 h-8 mb-4 text-gray-500 "
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                ></path>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 ">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 ">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            onChange={onSelectFile}
                        />
                    </label>
                </div>

                {imageSrc && (
                <div className="text-center mt-8 lg:mt-14 lg:ml-8">
                    <div className="relative w-80 h-64 rounded-md">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={25 / 25}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            className="w-full h-full "
                        />
                    </div>
                    <button
                        onClick={showCroppedImage}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Show Cropped Image
                    </button>
                </div>
            )}

            </div>

           

            
            {croppedImage && (
                <div className='w-full bg-white flex items-center justify-center flex-col mt-10'>
                    <h2>Cropped Image</h2>
                    <img src={croppedImage} alt="Cropped" className='w-full h-full lg:w-64 lg:h-auto' />
                </div>
                
            )}

            {barcode && <p>Barcode Number: {barcode}</p>}

            {data && (
            <div>
              <h2>Product Details:</h2>
              <p>Name: {data.product?.product_name}</p>
              <p>Brand: {data.product?.brands}</p>
              <p>Categories: {data.product.categories}</p>
              <p>Country: {data.product.countries}</p>
              <p>ecoscore: {data.product.ecoscore_grade}</p>
              <p>ingredient: {data.product.ingredients_text}</p>
              <p>total: {data.product.ingredients_n}</p>
              <p>quantity: {data.product.quantity}</p>
              <p>packaging: {data.product.packaging}</p>
              <p>labels: {data.product.labels}</p>
              <p>serving size: {data.product.serving_size}</p>
              <p>nova group: {data.product.nova_group}</p>
              <p>nutri score: {data.product.nutriscore_grade}</p>
              {/* <p>nova group tag: {data.product.nova_groups_tag}</p> */}
              <p>website: <a href={data.product.link} target="_blank" rel="noreferrer" style={{ color: "white" }}>{data.product.link}</a></p>



              <p>common name: {data.product.generic_name_en}</p>
              {/* <p>quantity: {data.product?.nutriscore[0].grade}</p> */}
              {/* <p>vegetarian: {data.product.ingredients[0].vegetarian}</p> */}

            </div>
          )}

        </div>
    )
}

export default Upload