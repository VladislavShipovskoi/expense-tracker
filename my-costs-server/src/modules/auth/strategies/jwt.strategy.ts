import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'src/modules/users/users.schema';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.accessTokenSecret'),
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

  async validate(payload: User) {
    return { id: payload._id, username: payload.username };
  }
}
