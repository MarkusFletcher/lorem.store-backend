import { Injectable } from '@nestjs/common'
import { PaginationDto } from './pagination.dto'

@Injectable()
export class PaginationService {
  getPagination(dto: PaginationDto, defaultPerPage = 20) {
    const page: number = dto.page ? +dto.page : 1
    const perPage: number = dto.perPage ? +dto.perPage : defaultPerPage

    const skip: number = (page - 1) * perPage

    return { perPage, skip }
  }
}
