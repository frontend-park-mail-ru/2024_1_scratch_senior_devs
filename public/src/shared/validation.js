export const ValidatePassword = (value) => {
    for (let index = 0; index < value.length; ++index){
        if (!(value.charCodeAt(index) >= 97 && value.charCodeAt(index) <= 122 ||
            value.charCodeAt(index) >= 64 && value.charCodeAt(index) <= 90 ||
            value.charCodeAt(index) >= 48 && value.charCodeAt(index) <= 57 ||
            value.charCodeAt(index) >= 35 && value.charCodeAt(index) <= 38)){
            return ValidationResult(false, "Пароль должен содержать только латинские символы, цифры или символы #$%&");
        }
    }

    if (value === "")
    {
        return ValidationResult(false, "Пароль не может быть пустым!")
    }

    if (value.length < 8){
        return ValidationResult(false, "Пароль должен быть не менее 8 символов!")
    }

    if (value.length > 20){
        return ValidationResult(false, "Пароль должен быть короче 20 символов!")
    }

    return ValidationResult(true)
}

export const ValidateLogin = (value) => {
    for (let index = 0; index < value.length; ++index){
        if (!(value.charCodeAt(index) >= 97 && value.charCodeAt(index) <= 122 ||
            value.charCodeAt(index) >= 64 && value.charCodeAt(index) <= 90 ||
            value.charCodeAt(index) >= 48 && value.charCodeAt(index) <= 57 )){
            return ValidationResult(false, "Логин должен содержать только латинские символы или цифры")
        }
    }

    if (value === "")
    {
        return ValidationResult(false, "Логин не может быть пустым!")
    }

    if (value.length < 4){
        return ValidationResult(false, "Логин должен быть не менее 4 символов!")
    }

    if (value.length > 12){
        return ValidationResult(false, "Логин должен быть короче 12 символов!")
    }

    return ValidationResult(true)
}

const ValidationResult = (result, message = null) => {
    return {result, message}
}