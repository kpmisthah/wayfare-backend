// import { Inject, Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ElasticsearchModule } from '@nestjs/elasticsearch';
// import { SearchService } from './elastic-search.service';

// @Module({
//   imports: [
//     ConfigModule,
//     ElasticsearchModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => {
//         const nodeUrl = configService.get<string>('ELASTICSEARCH_URL');
//         const username = configService.get<string>('ELASTICSEARCH_USER') || 'elastic';
//         const password = configService.get<string>('ELASTICSEARCH_PASSWORD') || 'changeme';

//         console.log('✅ Elasticsearch node:', nodeUrl);

//         if (!nodeUrl) {
//           throw new Error('ELASTICSEARCH_URL is undefined!');
//         }

//         return {
//           node: nodeUrl,
//           auth: { username, password },
//             tls: {
//                 rejectUnauthorized: false, 
//             },
//         };
//       },
//     Inject:[ConfigService]      
//     }),

//   ],
//   providers: [SearchService],
//   exports: [SearchService],
// })
// export class SearchModule {}
// @Module({
//     imports:[
//         ConfigModule,
//         ElasticsearchModule.registerAsync({
//             imports:[ConfigModule],
//             useFactory:async (configeService:ConfigService) =>({
//                 node:configeService.get('ELASTICSEARCH_URL')
//             }),
//             inject:[ConfigService]
//         })
//     ],
//     exports:[ElasticsearchModule]
// })
// export class SearchModule{}