
function FilterButton(props){
    return(
        <button type="button" className="btn toggle-btn" aria-pressed={props.pressed}>
            <span className="visually-hidden">Show </span>
            <span>{props.fltrType}</span>
            <span className="visually-hidden"> tasks</span>
        </button>
    );
}

export default FilterButton;