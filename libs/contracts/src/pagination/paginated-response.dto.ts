import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    isArray: true,
    description: 'The list of items for the current page',
  })
  data: T[];

  @ApiProperty({ type: Number, description: 'Total number of items available' })
  total: number;

  @ApiProperty({ type: Number, description: 'Current page number' })
  page: number;

  @ApiProperty({ type: Number, description: 'Number of items per page' })
  pageSize: number;

  @ApiProperty({ type: Number, description: 'Total number of pages' })
  totalPages: number;

  constructor(data: T[], total: number, page: number, pageSize: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(total / pageSize);
  }
}
