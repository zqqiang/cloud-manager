import React from 'react'
var _ = require('lodash')

const validate = {
    ipv4: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g,
    ipv4mask: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/g,
    ipv6: /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*/g
}

export class Input extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            error: false
        }
    }
    handleChange(e) {
        this.props.onChange(e)
        if (_.isFunction(this.props.validator)) {
            this.setState({
                error: this.props.validator()
            })
        } else {
            const validator = validate[this.props.validator]
            if (validator) {
                this.setState({
                    error: !e.target.value.match(validator)
                })
            }
        }
    }
    render() {
        let error = this.props.validator
        if (_.isFunction(this.props.validator)) {
            error = 'input'
        }
        return (
            <div className={"form-group" + (this.state.error ? " has-error" : "")}>
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
                    {this.state.error && <span className="help-block">{"Invalid " + error}</span>}
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
