import * as yup from 'yup';

export const requiredUsernameValidator = yup
  .string()
  .matches(
    /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._@]+(?<![_.])$/, // Không bắt đàu bằng . hoặc _, không chứa ._ _. __ .. ở giữa, không kêt thúc bằng _ hoặc ., chỉ chứa a-zA-Z0-9._@
    'Tên tài khoản không hợp lệ',
  )
  .min(6, 'Tổi thiểu 6 ký tự')
  .max(40, 'Tối đa 40 ký tự')
  .required('Bắt buộc');

export const requiredEmailValidator = yup
  .string()
  .email('Email không hợp lệ')
  .required('Bắt buộc');

export const requiredPasswordValidator = yup
  .string()
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    'Mật khẩu phải chứa ít nhất 8 ký tự, trong đó có phải có 1 chữ in thường, 1 chữ in hoa, 1 chữ số, và 1 ký tự đặt biệt',
  )
  .min(8, 'Tối thiểu 8 ký tự')
  .max(40, 'Tối đa 40 ký tự')
  .required('Bắt buộc');

export const requiredConfirmPasswordValidator = yup
  .string()
  .oneOf([yup.ref('password'), null], 'Mật khẩu không khớp')
  .required('Bắt buộc');

export const requiredFullNameValidator = yup
  .string()
  .matches(
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/,
    'Tên của bạn không hợp lệ',
  )
  .max(40, 'Tối đa 40 ký tự')
  .required('Bắt buộc');

export const requiredGradeNClassValidator = yup.string().required('Bắt buộc');
