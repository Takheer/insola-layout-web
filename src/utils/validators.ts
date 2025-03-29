import {
  required as _required,
  requiredIf as _requiredIf,
  maxValue as _maxValue,
  minValue as _minValue,
  maxLength as _maxLength,
  minLength as _minLength,
  sameAs as _sameAs,
  url as _url,
  email as _email,
  alpha as _alpha,
  numeric as _numeric,
  helpers
} from '@vuelidate/validators';

const { withMessage } = helpers;

export const required = withMessage('Это поле обязательно для заполнения', _required);

export const requiredIf = (value: Parameters<typeof _requiredIf>[0]) => withMessage(
'Это поле обязательно для заполнения',
_requiredIf(value)
);

export const maxValue = (value: Parameters<typeof _maxValue>[0]) => withMessage(
({ $params }) => `Значение не должно быть больше ${$params.max}`,
_maxValue(value)
);

export const minValue = (value: Parameters<typeof _minValue>[0]) => withMessage(
({ $params }) => `Значение не должно быть меньше ${$params.min}`,
_minValue(value)
);

export const maxLength = (value: Parameters<typeof _maxLength>[0]) => withMessage(
'Содержимое поля слишком длинное',
_maxLength(value)
);

export const minLength = (value: Parameters<typeof _minLength>[0]) => withMessage(
'Содержимое поля слишком короткое',
_minLength(value)
);

export const sameAs = (value: Parameters<typeof _sameAs>[0]) => withMessage(
'Поля должны совпадать',
_sameAs(value)
);

export const url = withMessage('Введите корректный URL', {
  ..._url,
  $validator: (...args) => {
    if (typeof args[0] === 'string' && args[0].indexOf('://www.')) {
      args[0] = args[0].replace('www.', '');
    }

    return _url.$validator(...args);
  }
});

export const email = withMessage('Введите корректный адрес электронной почты', _email);

export const alpha = withMessage('Поле содержит недопустимые символы', _alpha);

export const numeric = withMessage('Поле содержит недопустимые символы', _numeric);

export const maxFileSize = (maxSize: number) => withMessage(`Размер файла не должен превышать ${Math.floor(maxSize / 1048576)} МБ`, (value: File) => !helpers.req(value) || value.size <= maxSize);
