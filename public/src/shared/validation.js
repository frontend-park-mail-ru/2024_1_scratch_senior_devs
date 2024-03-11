/**
 * Выполняет валидацию пароля
 * @param value {string} переданная строка
 * @returns {{result: boolean, message: (string|null)}} вернет true - если пароль подходит, в противном случае false, а также сообщение об ошибке
 */
export const ValidatePassword = (value) => {
    for (let index = 0; index < value.length; ++index){
        if (!(value.charCodeAt(index) >= 97 && value.charCodeAt(index) <= 122 ||
            value.charCodeAt(index) >= 64 && value.charCodeAt(index) <= 90 ||
            value.charCodeAt(index) >= 48 && value.charCodeAt(index) <= 57 ||
            value.charCodeAt(index) >= 35 && value.charCodeAt(index) <= 38)){
            return ValidationResult(false, "Пароль должен содержать только латинские символы, цифры или символы #$%&");
        }
    }

    let regExp = /[a-zA-Z]/g;
    if (!regExp.test(value))
    {
        return ValidationResult(false, "Пароль должен содержать хотя бы одну букву!");
    }

    if (value === "")
    {
        return ValidationResult(false, "Пароль не может быть пустым!");
    }

    if (value.length < 8){
        return ValidationResult(false, "Пароль должен быть не менее 8 символов!");
    }

    if (value.length > 20){
        return ValidationResult(false, "Пароль должен быть короче 20 символов!");
    }

    return ValidationResult(true);
};

/**
 * Выполняет валидацию логина
 * @param value {string} переданная строка
 * @returns {{result: boolean, message: string | null}} вернет true - если логин подходит, в противном случае false, а также сообщение об ошибке
 */
export const ValidateLogin = (value) => {
    for (let index = 0; index < value.length; ++index){
        if (!(value.charCodeAt(index) >= 97 && value.charCodeAt(index) <= 122 ||
            value.charCodeAt(index) >= 64 && value.charCodeAt(index) <= 90 ||
            value.charCodeAt(index) >= 48 && value.charCodeAt(index) <= 57 )){
            return ValidationResult(false, "Логин должен содержать только латинские символы или цифры");
        }
    }

    if (value === "")
    {
        return ValidationResult(false, "Логин не может быть пустым!");
    }

    if (value.length < 4){
        return ValidationResult(false, "Логин должен быть не менее 4 символов!");
    }

    if (value.length > 12){
        return ValidationResult(false, "Логин должен быть короче 12 символов!");
    }

    return ValidationResult(true);
};

/**
 * Результат валидации
 * @param result {boolean} результат проверки
 * @param message {string | null} сообщение об ошибке
 * @returns {{result: boolean, message: string | null}}
 */
const ValidationResult = (result, message = null) => {
    return {result, message};
};