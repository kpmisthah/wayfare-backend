import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(readonly _configService: ConfigService) {
    super({
      clientID: _configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: _configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: _configService.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  } {
    if (!profile) {
      throw new Error('Google profile is undefined');
    }
    const { name, emails, photos } = profile;
    console.log(name, 'name', emails, 'emails', photos, 'photos');

    const user = {
      email: emails![0].value,
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      picture: photos?.[0]?.value || '',
    };
    console.log(user, 'user');
    return user;
  }
}
