export const corsOptions = {
      origin: 'https://wayfare.misthah.site',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Cookie',
        'X-Requested-With',
      ],
      exposedHeaders: ['Set-Cookie'],
}
