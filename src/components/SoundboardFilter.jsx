import React from "react";

class SoundboardFilter extends React.Component {
    constructor(props) {
        super(props);
        this.handleFilterValueChange = this.handleFilterValueChange.bind(this);
    }

    handleFilterValueChange(e) {
        this.props.onFilterValueChange(e)
    }

    render() {
        const {filterValue} = this.props;
        return (
            <div id="filter">
                <form>
                    <input id={'filter-field'} name="limit" type="text" size="50" onChange={this.handleFilterValueChange} value={filterValue} placeholder="Filtrer les sons   -   Ex. : Perceval"/>
                </form>
            </div>
        );
    }
}

export default SoundboardFilter;
