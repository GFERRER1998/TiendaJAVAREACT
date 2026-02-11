import "./SearchBox.css";
import { useState } from "react";

const SearchBox = ({ onSearch }) => {
    const [searchText, setSearchText] = useState("");

    const handleInput = (e) => {
        const text = e.target.value;
        setSearchText(text);
        onSearch(text);
    }
    return (
            
        <div className="input-group">
           <input type="text" className="form-control" placeholder="Search" value={searchText} onChange={handleInput} />
           <span className="input-group-text bg-warning">
            <i className="bi bi-search"></i>
            </span>
        </div>
    );
};

export default SearchBox;