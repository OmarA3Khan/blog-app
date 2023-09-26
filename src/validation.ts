interface Status {
    valid: Boolean,
    message?: string
}

type Rule = (value: string) => Status

export function length({min, max}: {min: number, max: number}): Rule {
    console.log('invoked length');
    return function (value: string): Status {
        console.log('invoked the return inside length');
        const result = Boolean(value.length > min && value.length < max)

        return {
            valid: result,
            message: result ? undefined : `This field must be between ${min} and ${max}`
        }
    }
}

export const required: Rule = (value:string): Status => {
    const result = Boolean(value)

    return {
        valid: result,
        message: result ? undefined : 'This field is required'
    }
}

export function validate (value: string, rules: Rule[]): Status {
    console.log('invoked validate');
    for (const rule of rules) {
        console.log('now inside of for loop')
        const result = rule(value)

        if(!result.valid) {
            return result
        }
    }

    return {
        valid: true
    }
}

console.log('running the file');

console.log(
    validate('aaaa', [length({min: 5, max: 10})]),
    validate('sssssssssaaaass', [length({min: 5, max: 10})]),
    validate('sasasasas', [length({min: 5, max: 10})]),
)