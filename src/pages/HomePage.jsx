import React from 'react'
import HomeButton from '../components/HomeButton'

const HomePage = () => {
  return (
            <div className=" relative  mx-auto lg:top-28  max-w-7xl  px-6 lg:px-8 pb-8 rounded-t-md bg-amber-400">
              <div className="mx-auto max-w-full min-h-screen lg:mx-0 font-body text-center flex flex-col justify-center items-center">
                <h2 className="text-4xl font-bold tracking-tight text-amber-800 sm:text-6xl ">nutriScan</h2>
                <p className="mt-6 mb-8 text-lg leading-8 text-amber-800">
                  Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
                  fugiat veniam occaecat fugiat aliqua.
                </p>
                <HomeButton/>
              </div>
              
            </div>
          
        )
      }
      


export default HomePage