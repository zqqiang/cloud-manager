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
                        type="text" 
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
