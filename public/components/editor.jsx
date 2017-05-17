import React from 'react'

export class Input extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(e) {
        this.props.onChange(e)
    }
    render() {
        return (
            <div className="form-group">
                <label className={this.props.labelClass + " control-label"}>{this.props.label}</label>
                <div className={this.props.editorClass}>
                    <input 
                        type={this.props.type ? this.props.type : "text"} 
                        name={this.props.name}
                        value={this.props.value}
                        onChange={this.handleChange}
                        className="form-control" 
                        placeholder={this.props.placeholder} 
                    />
                </div>
            </div>
        )
    }
}

export class Checkbox extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(e) {
        this.props.onChange(e)
    }
    render() {
        return (
            <div className="form-group">
                <div className={this.props.labelOffset + " " + this.props.editorClass}>
                    <div className="checkbox">
                        <label>
                            <input 
                                type="checkbox" 
                                name={this.props.name} 
                                checked={this.props.checked}
                                onChange={this.handleChange}
                            /> {this.props.label}
                        </label>
                    </div>
                </div>
            </div>
        )
    }
}

export class Button extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <button 
                type="submit" 
                className={"btn " + this.props.buttonClass} 
                onClick={this.props.action} 
            >
                {this.props.label}
            </button>
        )
    }
}

export class Select extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(e) {
        this.props.onChange(e)
    }
    render() {
        const options = this.props.options.map((option, index) =>
            <option key={index}>{option}</option>
        )
        return (
            <div className="form-group">
                <label className={this.props.labelClass + " control-label"}>{this.props.label}</label>
                <div className={this.props.editorClass}>
                    <select 
                        className={this.props.editorClass + " form-control"}
                        name={this.props.name}
                        value={this.props.value}
                        onChange={this.handleChange}
                    >
                        {options}
                    </select>
                </div>
            </div>
        )
    }
}
