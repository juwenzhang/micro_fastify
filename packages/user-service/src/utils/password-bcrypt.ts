import bcrypt from 'bcrypt';

export class PasswordUtils {
  static async hashPassword(password: string | number): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password.toString(), salt);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}