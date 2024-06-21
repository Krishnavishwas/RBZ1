import React, { useState, useEffect, useRef } from 'react';
import { MultiSelect } from 'primereact/multiselect';

const MultiSelectComponent = ({ selectedBanks, setSelectedBanks, vOption }) => {
  const [searchValue, setSearchValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(vOption);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setFilteredOptions(
      vOption.filter((option) => option.name.toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [searchValue, vOption]);

  const handleFilterInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const onFilter = (value) => {
    setSearchValue(value);
    setFilteredOptions(
      vOption.filter((option) => option.name.toLowerCase().includes(value.toLowerCase()))
    );
  };

  const onShow = () => {
    setTimeout(() => {
      let selectAllCheckbox = document.querySelector(
        ".p-multiselect-header > .p-multiselect-select-all"
      );
      if (selectAllCheckbox) {
        // Create a new input element for search
        let searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.name = "filteredOptions";
        searchInput.placeholder = "Search Banks";
        searchInput.className = "p-inputtext p-component w-full md:w-20rem";
  
        // Add event listener for filtering options
        searchInput.addEventListener("input", (event) => {
          onFilter(event.target.value);
        });
  
        // Append the input before the select all checkbox
        selectAllCheckbox.after(searchInput);
  
        // Focus on the input field
        searchInput.focus();
      }
    }, 0);
  };
  
  

  return (
    <>
     
      <MultiSelect
        value={selectedBanks}
        onChange={(e) => setSelectedBanks(e.value)}
        onShow={onShow}
        options={filteredOptions}
        optionLabel="name"
        placeholder="Select Banks"
        display="chip"
        className="w-full md:w-20rem"
       
      />
    </>
  );
};

export default MultiSelectComponent;
