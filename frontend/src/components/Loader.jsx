import React from 'react'
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const Loader = () => {

    const{navigate} = useContext(AppContext);
    const {nextUrl} = useParams();


    useEffect(()=> {
        if(nextUrl){
            setTimeout(() => {
                navigate(`/${nextUrl}`);
            } , 8000);
        }
    } ,[nextUrl]);
  return (
    <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full w-24 h-24 border-4 
        border-gray-300 border-top-blue'>

        </div>
      
    </div>
  )
}

export default Loader;
