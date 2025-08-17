// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt'; // Import JwtService
// import { UserService } from 'src/application/usecases/users/implementation/users.service';
// import { IUserService } from 'src/application/usecases/users/interfaces/user.service.interface';
// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(
//     private readonly configService: ConfigService,
//     @Inject('IUserService')
//     private readonly userService: IUserService,
//     private readonly jwtService: JwtService,
//   ) {
//     super({
//       clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
//       clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
//       callbackURL:
//         configService.get<string>('GOOGLE_CALLBACK_URL') ||
//         'http://localhost:3001/auth/google/callback',
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: VerifyCallback,
//   ): Promise<any> {
//     const { name, emails, photos } = profile;
//     const email = emails[0].value;
//     const firstName = name.givenName;
//     const lastName = name.familyName;
//     const picture = photos[0].value;

//     try {
//       // 1. Find or Create User in your database
//       let user = await this.userService.findByEmail(email);

//       if (!user) {
//         // If user doesn't exist, create them
//         user = await this.userService.create({
//           email,
//           name: firstName + lastName,
//           password: null,
//           refreshToken: null,
//         });
//       }

//       const payload = { sub: user?.id, email: user?.email, name: user?.name };
//       const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
//       if (!accessSecret) {
//         console.error('JWT_ACCESS_SECRET is missing in environment variables!');
//       }

//       const appAccessToken = this.jwtService.sign(payload, {
//         secret: accessSecret,
//         expiresIn: '5m', // e.g., '15m'
//       });
//       const appRefreshToken = this.jwtService.sign(payload, {
//         secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
//         expiresIn: '7d',
//       });

//       // 3. Update user with refresh token hash in DB (important for logout/revocation)
//       if (!user) {
//         throw new Error('User Not Found');
//       }

//       await this.userService.updateRefreshToken(user.id, appRefreshToken); // Implement this method in UserService

//       // 4. Pass only necessary user data and YOUR tokens to the controller via `done()`
//       // The controller will then set these as HTTP-only cookies.
//       // Returning tokens here is for the controller to pick them up, NOT for client-side JS.
//       done(null, {
//         user: {
//           id: user?.id,
//           email: user?.email,
//           name: user?.name,
//           // ... any other non-sensitive user data
//         },
//         appAccessToken,
//         appRefreshToken,
//       });
//     } catch (error) {
//       console.error('GoogleStrategy validate error:', error);
//       done(new UnauthorizedException('Google authentication failed'), false);
//     }
//   }
// }
