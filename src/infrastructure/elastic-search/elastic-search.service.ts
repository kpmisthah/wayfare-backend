// import { Injectable } from '@nestjs/common';
// import { ElasticsearchService } from '@nestjs/elasticsearch';

// @Injectable()
// export class SearchService {
//   constructor(private readonly elasticsearchService: ElasticsearchService) {}

//   async indexAgency(agency: any) {
//     return this.elasticsearchService.index({
//       index: 'agencies',
//       id: agency.id,
//       document: agency, // v8 uses 'document' instead of 'body'
//     });
//   }

//   async updateAgency(agency: any) {
//     return this.elasticsearchService.update({
//       index: 'agencies',
//       id: agency.id,
//       doc: agency, // v8 uses 'doc' at top-level
//     });
//   }

//   async searchAgency(query: string) {
//     const result = await this.elasticsearchService.search({
//       index: 'agencies',
//       query: {
//         multi_match: {
//           query,
//           fields: ['user.name', 'description', 'address', 'ownerName', 'websiteUrl'],
//           fuzziness: 'AUTO',
//         },
//       },
//       size: 10, // optional, default is 10
//     });

//     // v8 returns hits directly in result.hits.hits
//     return result.hits.hits.map((hit) => hit._source);
//   }
// }
