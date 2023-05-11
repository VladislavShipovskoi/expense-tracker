import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/entities/users/users.service';

@Injectable()
export class RegistrationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}
  async canActivate(
    context: ExecutionContext,
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { username } = request.body;
    const user = await this.userService.validateUser(username);
    if (user) {
      throw new UnauthorizedException(
        `User with name: ${username} already exist`,
      );
    }

    return true;
  }
}
