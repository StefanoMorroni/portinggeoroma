/*
 * Copyright 2020, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import PropTypes from 'prop-types';

import React from 'react';
import includes from 'lodash/includes';
import './css/formControlIntl.css';
import NumericInput from '../../libs/numeric-input/NumericInput';
/**
 * Localized Numeric Input. It provides an numeric input value that uses
 * separators (eg. ",",".") as they are used in the current selected language from context.
 * @prop {string|number} value a numeric value
 * @prop {string|number] defaultValue a value to use as default
 * @prop {function} onChange handler of change event. the argument of this handler is the current value inserted.
 * @prop {number} step the step when you click on arrows (up, down) of the input
 * @prop {function} onBlur event handler on blur event
 */
class IntlNumberFormControl extends React.Component {

    static propTypes = {
        type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onChange: PropTypes.func,
        step: PropTypes.number,
        locale: PropTypes.string,
        disabled: PropTypes.bool,
        onBlur: PropTypes.func
    }

    static contextTypes = {
        intl: PropTypes.object
    };

    render() {
        const {onChange, onBlur, disabled, type, step, value, defaultValue,
            ...formProps} = this.props;
        return (
            <NumericInput
                id={'intl-numeric'}
                step={step}
                {...formProps}
                {...value !== undefined ? {value: this.format(value) } : {defaultValue: this.format(defaultValue)}}
                format={this.format}
                onChange={(val) => {
                    val === null ? this.props.onChange("") : this.props.onChange(val.toString());
                }}
                onKeyUp={ev=>
                    !includes([37, 39], ev.keyCode)   // Allow navigation with left and right arrow key
                    && String(value).length !== ev.target.value.length
                    && ev.target.setSelectionRange(-1, -1)
                }
                onBlur={e=>{
                    if (onBlur) {
                        e.target.value = this.parse(e.target.value);
                        onBlur(e);
                    }
                }}
                disabled={disabled || false}
                parse={this.parse}
                onKeyPress={e => {
                    const allow = e.key.match(/^[a-zA-Z]*$/);
                    allow !== null && e.preventDefault();
                }}
                componentClass={"input"}
                className="form-control intl-numeric"
            />
        );
    }

    parse = value => {
        let formatValue = value;
        // eslint-disable-next-line use-isnan
        if (formatValue !== NaN && formatValue !== "NaN") {  // Allow locale string to parse
            const locale = this.context && this.context.intl && this.context.intl.locale || "en-US";
            const format = new Intl.NumberFormat(locale);
            const parts = format.formatToParts(12345.6);
            const numerals = Array.from({ length: 10 }).map((_, i) => format.format(i));
            const index = new Map(numerals.map((d, i) => [d, i]));
            const group = new RegExp(
                `[${parts.find(d => d.type === "group").value}]`,
                "g"
            );
            const decimal = new RegExp(
                `[${parts.find(d => d.type === "decimal").value}]`
            );
            const numeral = new RegExp(`[${numerals.join("")}]`, "g");
            const rIndex = d => index.get(d);

            formatValue = (formatValue
                .trim()
                .replace(group, "")
                .replace(decimal, ".")
                .replace(numeral, rIndex));
            return formatValue ? +formatValue : NaN;
        }
        return "";
    };

    format = val => {
        if (!isNaN(val) && val !== "NaN") {
            const locale = this.context && this.context.intl && this.context.intl.locale || "en-US";
            const formatter = new Intl.NumberFormat(locale, {minimumFractionDigits: 0, maximumFractionDigits: 20});
            return formatter.format(val);
        }
        return "";
    };
}

export default IntlNumberFormControl;
