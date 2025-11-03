import { useState,useCallback } from "react";

const useSelect = (selectType) => {
    const [selectedMenu, setSelectedMenu] = useState(selectType);
    
    const handleSelect=useCallback((menuType)=>{
        setSelectedMenu(menuType);
    },[]);

    return{
        selectedMenu,handleSelect   
    };
  };
  export default useSelect;