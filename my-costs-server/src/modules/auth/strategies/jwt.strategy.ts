import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'src/modules/users/users.schema';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { jwtConstants } from '../constants';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'jwt' in req.cookies &&
      req.cookies.jwt.access_token.length > 0
    ) {
      return req.cookies.jwt.access_token;
    }
    return null;
  }

  async validate(req: Request, payload: User) {
    if (!payload) {
      throw new BadRequestException('invalid jwt token');
    }

    const data = req?.cookies['jwt'];

    if (!data?.refresh_token) {
      throw new BadRequestException('invalid refresh token');
    }

    const user = await this.authService.getUserByTokenData(data.access_token);

    if (!user) {
      throw new BadRequestException('token expired');
    }

    return user;
  }
}
