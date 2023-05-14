import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/modules/users/users.service';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  async canActivate(
    context: ExecutionContext,
    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { refresh_token } = this.authService.getTokens(request);
    const { username } = request.body;

    if (!refresh_token) {
      throw new UnauthorizedException('refresh_token field is required');
    }

    if (!username) {
      throw new UnauthorizedException('username token field is required');
    }

    const user = await this.userService.findOne(username);

    if (!user) {
      throw new UnauthorizedException(
        `User with name: ${username} does not exist`,
      );
    }

    return true;
  }
}
