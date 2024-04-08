export class Validate {
  static email(email: string): boolean {
    // Sử dụng một biểu thức chính quy để kiểm tra định dạng email
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  }

  static Password(password: string): boolean {
    return password.length >= 6;
  }

  static EventValidation = (data: any) => {
    const mess: string[] = [];
    Object.keys(data).forEach(key => {
      if (key !== 'description' && key !== 'users') {
        !data[`${key}`] && mess.push(`${key} is required!!!`);
      }
    });

    return mess;
  };
}
